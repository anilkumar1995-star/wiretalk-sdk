package com.wiretalk.sdk

import org.json.JSONObject

data class WiretalkBridgeEvent(
    val type: String,
    val raw: JSONObject,
) {
    val visitorUid: String? get() = raw.optString("visitor_uid").takeIf { it.isNotBlank() }
    val conversationId: Long? get() = raw.optLong("conversation_id").takeIf { raw.has("conversation_id") && !raw.isNull("conversation_id") }
    val unreadCount: Int get() = raw.optInt("count", 0)
    val messageId: Long? get() = raw.optLong("message_id").takeIf { raw.has("message_id") }
    val messageBody: String? get() = raw.optString("body").takeIf { it.isNotBlank() }
    val isOpen: Boolean get() = raw.optBoolean("open", false)
    val tab: String? get() = raw.optString("tab").takeIf { it.isNotBlank() }
}

fun interface WiretalkBridgeListener {
    fun onEvent(event: WiretalkBridgeEvent)
}

object WiretalkBridge {
    fun parse(payload: String): WiretalkBridgeEvent? {
        return try {
            val json = JSONObject(payload)
            val type = json.optString("type")
            if (type.isBlank()) null else WiretalkBridgeEvent(type, json)
        } catch (_: Exception) {
            null
        }
    }

    fun buildCommand(type: String, fields: Map<String, Any?> = emptyMap()): String {
        val json = JSONObject()
        json.put("wiretalk", true)
        json.put("type", type)
        fields.forEach { (key, value) ->
            when (value) {
                null -> Unit
                is Number -> json.put(key, value)
                is Boolean -> json.put(key, value)
                else -> json.put(key, value.toString())
            }
        }
        return """
            window.dispatchEvent(new MessageEvent('message', { data: ${json} }));
        """.trimIndent()
    }

    fun open(tab: String = "chat") = buildCommand("widget:open", mapOf("tab" to tab))

    fun close() = buildCommand("widget:close")

    fun toggle() = buildCommand("widget:toggle")

    fun updateVisitor(name: String? = null, email: String? = null, phone: String? = null): String {
        val fields = mutableMapOf<String, Any?>()
        name?.let { fields["name"] = it }
        email?.let { fields["email"] = it }
        phone?.let { fields["phone"] = it }
        return buildCommand("visitor:update", fields)
    }

    fun storageSet(key: String, value: String) = buildCommand("storage:set", mapOf("key" to key, "value" to value))

    fun storageRemove(key: String) = buildCommand("storage:remove", mapOf("key" to key))
}
