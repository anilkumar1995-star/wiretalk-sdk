plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    id("kotlin-parcelize")
    id("maven-publish")
}

val wiretalkVersion: String = project.findProperty("wiretalk.version")?.toString() ?: "1.0.0"
val wiretalkGroup: String = project.findProperty("wiretalk.group")?.toString() ?: "tech.wiretalk"

android {
    namespace = "com.wiretalk.sdk"
    compileSdk = 34

    defaultConfig {
        minSdk = 24
        consumerProguardFiles("consumer-rules.pro")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    publishing {
        singleVariant("release") {
            withSourcesJar()
        }
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.core:core-ktx:1.13.1")
}

publishing {
    publications {
        create<MavenPublication>("release") {
            groupId = wiretalkGroup
            artifactId = "wiretalk-android"
            version = wiretalkVersion

            afterEvaluate {
                from(components["release"])
            }

            pom {
                name.set("Wiretalk Android SDK")
                description.set("WebView SDK for Wiretalk live chat")
                url.set("https://github.com/anilkumar1995-star/wiretalk-sdk")
                licenses {
                    license {
                        name.set("MIT")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                }
            }
        }
    }
}
