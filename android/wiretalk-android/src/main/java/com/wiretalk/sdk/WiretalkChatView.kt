package com.wiretalk.sdk

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.AttributeSet
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity

@SuppressLint("SetJavaScriptEnabled")
class WiretalkChatView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : FrameLayout(context, attrs) {

    val webView = WebView(context)
    private var listener: WiretalkBridgeListener? = null

    init {
        webView.layoutParams = LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        )
        addView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
        }
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean = false
        }
        webView.addJavascriptInterface(NativeBridge(), "WiretalkAndroid")
    }

    fun setBridgeListener(listener: WiretalkBridgeListener?) {
        this.listener = listener
    }

    fun load(config: WiretalkConfig) {
        webView.loadUrl(config.popoutUrl())
    }

    fun openChat(tab: String = "chat") = sendCommand(WiretalkBridge.open(tab))

    fun closeChat() = sendCommand(WiretalkBridge.close())

    fun toggleChat() = sendCommand(WiretalkBridge.toggle())

    fun updateVisitor(name: String? = null, email: String? = null, phone: String? = null) {
        sendCommand(WiretalkBridge.updateVisitor(name, email, phone))
    }

    fun persistVisitorUid(uid: String) {
        sendCommand(WiretalkBridge.storageSet("wiretalk_visitor_uid", uid))
    }

    private fun sendCommand(script: String) {
        webView.post { webView.evaluateJavascript(script, null) }
    }

    private inner class NativeBridge {
        @JavascriptInterface
        fun postMessage(payload: String) {
            post {
                WiretalkBridge.parse(payload)?.let { event ->
                    listener?.onEvent(event)
                }
            }
        }
    }
}

class WiretalkChatActivityImpl : AppCompatActivity() {
    private lateinit var chatView: WiretalkChatView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val config = WiretalkChatActivity.readConfig(intent)
            ?: throw IllegalStateException("WiretalkConfig missing")

        val prefs = getSharedPreferences("wiretalk", MODE_PRIVATE)
        val savedUid = prefs.getString("visitor_uid", null)
        val effectiveConfig = if (savedUid.isNullOrBlank()) config else config.withVisitorUid(savedUid)

        chatView = WiretalkChatView(this)
        chatView.setBridgeListener { event ->
            when (event.type) {
                "widget:ready" -> event.visitorUid?.let { uid ->
                    prefs.edit().putString("visitor_uid", uid).apply()
                }
            }
        }
        setContentView(chatView)
        chatView.load(effectiveConfig)
    }
}
