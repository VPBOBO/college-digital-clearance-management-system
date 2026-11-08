package com.samplecollege.cdcms;

import android.app.Activity;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.List;
import java.util.Map;

/** First-slice Android student client. Uses the same server-managed HttpOnly session cookie as the web client. */
public class MainActivity extends Activity {
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final CookieManager cookieManager = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
    private LinearLayout content;
    private EditText apiBaseInput;
    private EditText usernameInput;
    private EditText passwordInput;
    private TextView messageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLogin();
    }

    @Override
    protected void onDestroy() {
        executor.shutdown();
        super.onDestroy();
    }

    private void showLogin() {
        ScrollView scroll = new ScrollView(this);
        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(24), dp(30), dp(24), dp(30));
        scroll.addView(content);
        setContentView(scroll);

        TextView brand = text("CDCMS", 13, true);
        brand.setTextColor(0xff51718f);
        content.addView(brand);
        TextView title = text("Student clearance", 28, true);
        title.setTextColor(0xff172e49);
        LinearLayout.LayoutParams titleParams = params();
        titleParams.topMargin = dp(8);
        content.addView(title, titleParams);
        TextView subtitle = text("Sign in to view your own assigned requirements and progress.", 14, false);
        subtitle.setTextColor(0xff718196);
        content.addView(subtitle, spaced(0, 8, 0, 22));

        label("API server URL");
        apiBaseInput = input("http://localhost:3000");
        content.addView(apiBaseInput, spaced(0, 5, 0, 14));
        label("Username");
        usernameInput = input("student-a");
        content.addView(usernameInput, spaced(0, 5, 0, 14));
        label("Password");
        passwordInput = input("");
        passwordInput.setInputType(129);
        content.addView(passwordInput, spaced(0, 5, 0, 14));

        Button signIn = button("Sign in");
        content.addView(signIn, spaced(0, 12, 0, 10));
        signIn.setOnClickListener(v -> signIn());
        messageView = text("Physical phone (ADB reverse): http://localhost:3000. Emulator: http://10.0.2.2:3000.", 12, false);
        messageView.setTextColor(0xff718196);
        content.addView(messageView, spaced(0, 10, 0, 0));
    }

    private void signIn() {
        final String base = normalizeBase(apiBaseInput.getText().toString());
        final String username = usernameInput.getText().toString().trim();
        final String password = passwordInput.getText().toString();

        if (username.isEmpty() || password.isEmpty()) {
            message("Enter both username and password.");
            return;
        }

        message("Signing in…");

        executor.execute(() -> {
            String stage = "login request";

            try {
                JSONObject payload = new JSONObject();
                payload.put("username", username);
                payload.put("password", password);

                request(base, "POST", "/api/auth/login", payload);

                stage = "session verification (/api/me)";

                JSONObject me = request(base, "GET", "/api/me", null).getJSONObject("user");

                JSONArray roles = me.getJSONArray("roles");
                boolean isStudent = false;

                for (int i = 0; i < roles.length(); i++) {
                    if ("Student".equals(roles.getString(i))) isStudent = true;
                }

                if (!isStudent) { throw new Exception("This Android first-slice app is for Student accounts. Use the web portal for office reviewers.");
                }

                stage = "loading student clearance";

                JSONObject result = request(base, "GET", "/api/student/clearance-requests", null);

                runOnUiThread(() -> showStudent(me, result, base));

            } catch (Exception e) {
                String failedStage = stage;

                runOnUiThread(() -> message("Sign-in failed: " + failedStage + ": " + safeMessage(e)));
            }
        });
    }

    private void showStudent(JSONObject user, JSONObject result, String base) {
        ScrollView scroll = new ScrollView(this);
        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(20), dp(24), dp(20), dp(30));
        scroll.addView(content);
        setContentView(scroll);

        TextView eyebrow = text("SAMPLE COLLEGE · STUDENT VIEW", 10, true);
        eyebrow.setTextColor(0xff68809a);
        content.addView(eyebrow);
        TextView title = text("My clearance", 28, true);
        title.setTextColor(0xff172e49);
        content.addView(title, spaced(0, 8, 0, 4));
        content.addView(text(user.optString("displayName", "Student"), 14, false), spaced(0, 0, 0, 12));
        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        Button refresh = button("Refresh");
        Button logout = button("Sign out");
        actions.addView(refresh, new LinearLayout.LayoutParams(0, dp(46), 1));
        actions.addView(logout, spacedWeight(10, 0, 0, 0, 1));
        content.addView(actions, spaced(0, 6, 0, 8));
        messageView = text("", 12, false);
        messageView.setTextColor(0xff718196);
        content.addView(messageView, spaced(0, 0, 0, 10));
        refresh.setOnClickListener(v -> loadStudent(base, user));
        logout.setOnClickListener(v -> {
            executor.execute(() -> {
                try { request(base, "POST", "/api/auth/logout", new JSONObject()); } catch (Exception ignored) {}
                cookieManager.getCookieStore().removeAll();
                runOnUiThread(this::showLogin);
            });
        });

        JSONArray requests = result.optJSONArray("requests");
        if (requests == null || requests.length() == 0) {
            content.addView(text("No clearance request found. Ask the administrator to assign a clearance template.", 14, false), spaced(0, 15, 0, 0));
        } else {
            for (int i = 0; i < requests.length(); i++) {
                JSONObject request = requests.optJSONObject(i);
                if (request != null) renderRequest(request);
            }
        }
    }

    private void loadStudent(String base, JSONObject user) {
        message("Refreshing clearance…");
        executor.execute(() -> {
            try {
                JSONObject result = request(base, "GET", "/api/student/clearance-requests", null);
                runOnUiThread(() -> showStudent(user, result, base));
            } catch (Exception e) {
                runOnUiThread(() -> message("Refresh failed: " + safeMessage(e)));
            }
        });
    }

    private void renderRequest(JSONObject request) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(16), dp(16), dp(16), dp(16));
        card.setBackgroundColor(0xfff0f4f8);
        LinearLayout.LayoutParams cardParams = spaced(0, 0, 0, 16);
        content.addView(card, cardParams);
        String requestId = request.optString("requestId");
        TextView heading = text("Clearance #" + requestId, 19, true);
        heading.setTextColor(0xff1d3c5d);
        card.addView(heading);
        card.addView(text(request.optString("academicPeriod"), 12, false), spaced(0, 4, 0, 10));
        JSONObject completion = request.optJSONObject("completion");
        if (completion != null) {
            card.addView(text(completion.optString("displayLabel") + " · " + completion.optInt("mandatoryApproved") + "/" + completion.optInt("mandatoryTotal") + " mandatory approved", 13, true));
        }
        JSONArray items = request.optJSONArray("requirements");
        if (items != null) {
            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.optJSONObject(i);
                if (item == null) continue;
                View divider = new View(this);
                divider.setBackgroundColor(0xffdce5ed);
                card.addView(divider, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(1)));
                TextView name = text(item.optString("requirementName"), 14, true);
                name.setTextColor(0xff28435e);
                card.addView(name, spaced(0, 11, 0, 3));
                String kind = item.optBoolean("isMandatory") ? "Mandatory" : "Optional";
                TextView status = text(kind + " · " + item.optString("status"), 12, true);
                status.setTextColor(statusColor(item.optString("status")));
                card.addView(status);
                String remark = item.optString("remark", "");
                if (!remark.isEmpty() && !"null".equals(remark)) {
                    card.addView(text("Reviewer remark: " + remark, 12, false), spaced(0, 4, 0, 0));
                }
            }
        }
    }

    private int statusColor(String status) {
        if ("Approved".equals(status)) return 0xff197044;
        if ("Rejected".equals(status)) return 0xffa33a3a;
        return 0xff926300;
    }

    private JSONObject request(String base, String method, String path, JSONObject body) throws Exception {
        URL url = new URL(base + path);
        URI uri = url.toURI();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod(method);
        connection.setConnectTimeout(8000);
        connection.setReadTimeout(12000);
        connection.setRequestProperty("Accept", "application/json");

        // Attach cookies previously received from this server.
        Map<String, List<String>> cookieHeaders =
            cookieManager.get(uri, connection.getRequestProperties());

        for (Map.Entry<String, List<String>> header : cookieHeaders.entrySet()) {
            StringBuilder value = new StringBuilder();

            for (String part : header.getValue()) {
                if (value.length() > 0) value.append("; ");
                value.append(part);
            }

            if (value.length() > 0) {
                connection.setRequestProperty(header.getKey(), value.toString());
            }
        }

        if (body != null) {
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");

            try (OutputStream out = connection.getOutputStream()) {
                out.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }
        }

        int status = connection.getResponseCode();

        // Store cookies returned by the server, including the login session.
        cookieManager.put(uri, connection.getHeaderFields());

        InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        StringBuilder text = new StringBuilder();
        if (stream != null) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) text.append(line);
            }
        }
        connection.disconnect();
        JSONObject json = text.length() == 0 ? new JSONObject() : new JSONObject(text.toString());
        if (status < 200 || status >= 300) {
            JSONObject error = json.optJSONObject("error");
            throw new Exception(error == null ? "HTTP " + status : error.optString("message", "HTTP " + status));
        }
        return json;
    }

    private String normalizeBase(String value) {
        String base = value == null ? "" : value.trim();
        while (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base;
    }

    private String safeMessage(Exception error) {
        String message = error.getMessage();
        return message == null ? "Request could not be completed." : message;
    }

    private void message(String value) {
        if (messageView != null) messageView.setText(value);
    }

    private TextView text(String value, int size, boolean bold) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextSize(size);
        if (bold) view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return view;
    }

    private void label(String value) {
        TextView label = text(value, 12, true);
        label.setTextColor(0xff496176);
        content.addView(label);
    }

    private EditText input(String value) {
        EditText edit = new EditText(this);
        edit.setSingleLine(true);
        edit.setText(value);
        edit.setTextSize(14);
        return edit;
    }

    private Button button(String value) {
        Button button = new Button(this);
        button.setText(value);
        return button;
    }

    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private LinearLayout.LayoutParams params() { return new LinearLayout.LayoutParams(-1, -2); }
    private LinearLayout.LayoutParams spaced(int left, int top, int right, int bottom) {
        LinearLayout.LayoutParams p = params(); p.setMargins(dp(left),dp(top),dp(right),dp(bottom)); return p;
    }
    private LinearLayout.LayoutParams spacedWeight(int left, int top, int right, int bottom, float weight) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(0,dp(46),weight);p.setMargins(dp(left),dp(top),dp(right),dp(bottom));return p;
    }
}
