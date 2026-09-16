package com.wiretalk.sdk

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.UUID

enum class WiretalkPlatform(val queryValue: String) {
    ANDROID("android"),
    IOS("ios"),
    REACT_NATIVE("react-native"),
    FLUTTER("flutter"),
    CAPACITOR("capacitor"),
    CORDOVA("cordova"),
}

@Parcelize
data class WiretalkConfig(
    val baseUrl: String,
    val widgetKey: String,
    val appId: String,
    val platform: WiretalkPlatform = WiretalkPlatform.ANDROID,
    val locale: String = "en",
    val initialTab: String = "chat",
    val visitorUid: String? = null,
    val visitorName: String? = null,
    val visitorEmail: String? = null,
    val visitorPhone: String? = null,
    val appVersion: String? = null,
    val appBuild: String? = null,
) : Parcelable {
    fun popoutUrl(): String {
        val base = baseUrl.trimEnd('/')
        val params = linkedMapOf(
            "locale" to locale,
            "tab" to initialTab,
            "platform" to platform.queryValue,
            "app_id" to appId,
        )
        visitorUid?.takeIf { it.isNotBlank() }?.let { params["visitor_uid"] = it }
        visitorName?.takeIf { it.isNotBlank() }?.let { params["visitor_name"] = it }
        visitorEmail?.takeIf { it.isNotBlank() }?.let { params["visitor_email"] = it }
        visitorPhone?.takeIf { it.isNotBlank() }?.let { params["visitor_phone"] = it }
        appVersion?.takeIf { it.isNotBlank() }?.let { params["app_version"] = it }
        appBuild?.takeIf { it.isNotBlank() }?.let { params["app_build"] = it }

        val query = params.entries.joinToString("&") { (key, value) ->
            "${Uri.encode(key)}=${Uri.encode(value)}"
        }

        return "$base/popout/${Uri.encode(widgetKey)}?$query"
    }

    fun withVisitorUid(uid: String?) = copy(visitorUid = uid?.takeIf { it.isNotBlank() })

    companion object {
        fun generateVisitorUid(): String = UUID.randomUUID().toString()
    }
}

object WiretalkChatActivity {
    private const val EXTRA_CONFIG = "wiretalk_config"

    fun launch(context: Context, config: WiretalkConfig) {
        val intent = Intent(context, WiretalkChatActivityImpl::class.java).apply {
            putExtra(EXTRA_CONFIG, config)
        }
        context.startActivity(intent)
    }

    internal fun readConfig(intent: Intent?): WiretalkConfig? {
        return intent?.getParcelableExtra(EXTRA_CONFIG)
    }
}
