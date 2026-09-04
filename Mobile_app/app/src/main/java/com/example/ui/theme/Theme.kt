package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = HeritageTerracottaDark,
    onPrimary = HeritageOnPrimaryContainer,
    primaryContainer = HeritageTerracotta,
    onPrimaryContainer = HeritagePrimaryContainer,
    secondary = HeritageRustDark,
    tertiary = HeritageTealDark,
    background = Color(0xFF1C1B1B),
    surface = Color(0xFF1C1B1B),
    onBackground = Color(0xFFE6E1E5),
    onSurface = Color(0xFFE6E1E5),
  )

private val LightColorScheme =
  lightColorScheme(
    primary = HeritageTerracotta,
    onPrimary = HeritageOnPrimary,
    primaryContainer = HeritagePrimaryContainer,
    onPrimaryContainer = HeritageOnPrimaryContainer,
    secondary = HeritageRust,
    secondaryContainer = HeritageRustContainer,
    onSecondaryContainer = HeritageOnRustContainer,
    tertiary = HeritageTeal,
    background = HeritageBackground,
    surface = HeritageSurface,
    surfaceVariant = HeritageSurfaceVariant,
    onBackground = HeritageOnSurface,
    onSurface = HeritageOnSurface,
    onSurfaceVariant = HeritageOnSurfaceVariant,
    outline = HeritageOutline,
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = false,
  // Dynamic color disabled to ensure uniform clean white theme
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }

      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
