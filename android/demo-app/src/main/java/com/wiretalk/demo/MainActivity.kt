package com.wiretalk.demo

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.wiretalk.sdk.WiretalkChatActivity
import com.wiretalk.sdk.WiretalkConfig

/**
 * Minimal demo — replace [BASE_URL], [WIDGET_KEY], and [APP_ID] before running.
 * Add `app:com.wiretalk.demo` to Widget Settings → Allowed Domains.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val badge = TextView(this).apply {
            text = "Unread: 0"
            textSize = 16f
        }

        val openBtn = Button(this).apply {
            text = "Open support chat"
            setOnClickListener { openChat() }
        }

        setContentView(
            LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                val pad = (24 * resources.displayMetrics.density).toInt()
                setPadding(pad, pad, pad, pad)
                addView(badge)
                addView(openBtn)
            },
        )
    }

    private fun openChat() {
        WiretalkChatActivity.launch(
            this,
            WiretalkConfig(
                baseUrl = BASE_URL,
                widgetKey = WIDGET_KEY,
                appId = APP_ID,
                visitorName = "Demo User",
                visitorEmail = "demo@example.com",
            ),
        )
    }

    companion object {
        private const val BASE_URL = "https://wiretalk.tech"
        private const val WIDGET_KEY = "wk_REPLACE_ME"
        private const val APP_ID = "com.wiretalk.demo"
    }
}
