package com.example

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.*

sealed class HeritageScreen {
  data class Tab(val tabIndex: Int) : HeritageScreen()
  data class MonumentDetail(val monumentId: String, val returnTab: Int = 0) : HeritageScreen()
  data class MarketDetail(val marketId: String, val returnTab: Int = 0) : HeritageScreen()
  data class MoreApps(val returnTab: Int = 0) : HeritageScreen()
}

@Composable
fun IndianHeritageApp() {
  var currentScreen by remember { mutableStateOf<HeritageScreen>(HeritageScreen.Tab(0)) }
  var isDrawerOpen by remember { mutableStateOf(false) }
  var favorites by remember { mutableStateOf(setOf("rajwada-palace")) }
  var visitedSiteIds by remember { mutableStateOf(setOf("rajwada-palace", "lal-bagh-palace")) }

  val toggleFavorite = { id: String ->
    favorites = if (favorites.contains(id)) favorites - id else favorites + id
  }

  val toggleVisitedSite = { id: String ->
    visitedSiteIds = if (visitedSiteIds.contains(id)) visitedSiteIds - id else visitedSiteIds + id
  }

  val activeTab = when (val s = currentScreen) {
    is HeritageScreen.Tab -> s.tabIndex
    is HeritageScreen.MonumentDetail -> s.returnTab
    is HeritageScreen.MarketDetail -> s.returnTab
    is HeritageScreen.MoreApps -> s.returnTab
  }

  Box(modifier = Modifier.fillMaxSize().background(HeritageBackground)) {
    Scaffold(
      containerColor = HeritageBackground,
      bottomBar = {
        if (currentScreen is HeritageScreen.Tab) {
          NavigationBar(
            containerColor = HeritageBackground,
            tonalElevation = 8.dp,
            modifier = Modifier.border(width = 0.5.dp, color = HeritageOutline)
          ) {
            val items = listOf(
              Triple("Home", Icons.Filled.Home, Icons.Outlined.Home),
              Triple("Search", Icons.Filled.Search, Icons.Outlined.Search),
              Triple("Nearby", Icons.Filled.LocationOn, Icons.Outlined.LocationOn),
              Triple("Explore", Icons.Filled.Explore, Icons.Outlined.Explore),
              Triple("Profile", Icons.Filled.Person, Icons.Outlined.Person)
            )
            items.forEachIndexed { index, item ->
              val selected = activeTab == index
              NavigationBarItem(
                selected = selected,
                onClick = { currentScreen = HeritageScreen.Tab(index) },
                icon = {
                  Icon(
                    imageVector = if (selected) item.second else item.third,
                    contentDescription = item.first,
                    tint = if (selected) HeritageTerracotta else HeritageOnSurfaceVariant
                  )
                },
                label = {
                  Text(
                    item.first,
                    fontSize = 10.sp,
                    fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
                    color = if (selected) HeritageOnSurface else HeritageOnSurfaceVariant
                  )
                },
                colors = NavigationBarItemDefaults.colors(
                  indicatorColor = HeritageTerracotta.copy(alpha = 0.12f)
                )
              )
            }
          }
        }
      }
    ) { innerPadding ->
      Box(
        modifier = Modifier
          .fillMaxSize()
          .padding(innerPadding)
      ) {
        when (val screen = currentScreen) {
          is HeritageScreen.Tab -> {
            when (screen.tabIndex) {
              0 -> ComposeHomeScreen(
                onOpenDrawer = { isDrawerOpen = true },
                onSelectMonument = { currentScreen = HeritageScreen.MonumentDetail(it, 0) },
                onSelectMarket = { currentScreen = HeritageScreen.MarketDetail(it, 0) },
                onSeeAllMonuments = { currentScreen = HeritageScreen.Tab(1) },
                onNavigateToMoreApps = { currentScreen = HeritageScreen.MoreApps(0) },
                favorites = favorites,
                onToggleFavorite = toggleFavorite
              )
              1 -> ComposeSearchScreen(
                onOpenDrawer = { isDrawerOpen = true },
                onSelectMonument = { currentScreen = HeritageScreen.MonumentDetail(it, 1) },
                favorites = favorites,
                onToggleFavorite = toggleFavorite
              )
              2 -> ComposeNearbyScreen(
                onSelectMonument = { currentScreen = HeritageScreen.MonumentDetail(it, 2) }
              )
              3 -> ComposeExploreScreen(
                onOpenDrawer = { isDrawerOpen = true },
                onSelectMonument = { currentScreen = HeritageScreen.MonumentDetail(it, 3) },
                onOpenSearch = { currentScreen = HeritageScreen.Tab(1) }
              )
              4 -> ComposePassportScreen(
                onOpenDrawer = { isDrawerOpen = true },
                onNavigateToMoreApps = { currentScreen = HeritageScreen.MoreApps(4) },
                visitedSiteIds = visitedSiteIds,
                onSelectMonument = { currentScreen = HeritageScreen.MonumentDetail(it, 4) }
              )
            }
          }
          is HeritageScreen.MonumentDetail -> {
            ComposeMonumentDetailScreen(
              monumentId = screen.monumentId,
              onBack = { currentScreen = HeritageScreen.Tab(screen.returnTab) },
              isFavorite = favorites.contains(screen.monumentId),
              onToggleFavorite = { toggleFavorite(screen.monumentId) },
              isVisited = visitedSiteIds.contains(screen.monumentId),
              onToggleVisited = { toggleVisitedSite(screen.monumentId) },
              onNavigateToPassport = { currentScreen = HeritageScreen.Tab(4) }
            )
          }
          is HeritageScreen.MarketDetail -> {
            ComposeMarketDetailScreen(
              marketId = screen.marketId,
              onBack = { currentScreen = HeritageScreen.Tab(screen.returnTab) },
              isFavorite = favorites.contains(screen.marketId),
              onToggleFavorite = { toggleFavorite(screen.marketId) }
            )
          }
          is HeritageScreen.MoreApps -> {
            ComposeMoreAppsScreen(
              onBack = { currentScreen = HeritageScreen.Tab(screen.returnTab) }
            )
          }
        }
      }
    }

    // Side Drawer Overlay
    if (isDrawerOpen) {
      ComposeDharoharDrawer(
        onClose = { isDrawerOpen = false },
        onNavigateToMoreApps = {
          isDrawerOpen = false
          currentScreen = HeritageScreen.MoreApps(activeTab)
        }
      )
    }
  }
}

// -------------------------------------------------------------------------------------------------
// 1. HOME SCREEN (Stitch Image 1)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeHomeScreen(
  onOpenDrawer: () -> Unit,
  onSelectMonument: (String) -> Unit,
  onSelectMarket: (String) -> Unit,
  onSeeAllMonuments: () -> Unit,
  onNavigateToMoreApps: () -> Unit,
  favorites: Set<String>,
  onToggleFavorite: (String) -> Unit
) {
  var isMuted by remember { mutableStateOf(false) }
  var activeChapter by remember { mutableStateOf(0) }
  val chapters = listOf("01 Rajwada Palace", "02 Sarafa By Night", "03 Mandu Gates")

  Box(modifier = Modifier.fillMaxSize()) {
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
      // Top Bar
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onOpenDrawer, modifier = Modifier.testTag("home_menu_btn")) {
        Icon(Icons.Filled.Menu, contentDescription = "Menu", tint = HeritageOnSurface)
      }
      Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
          "Indian Heritage",
          fontFamily = FontFamily.Serif,
          fontWeight = FontWeight.Bold,
          fontSize = 22.sp,
          color = HeritageTerracotta
        )
      }
      Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = {}) {
          Icon(Icons.Outlined.Notifications, contentDescription = "Notifications", tint = HeritageTerracotta)
        }
        IconButton(onClick = {}) {
          Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Favorites", tint = HeritageTerracotta)
        }
      }
    }

    // Greeting Section
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 6.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          "WELCOME BACK",
          fontSize = 11.sp,
          fontWeight = FontWeight.Bold,
          color = HeritageOnSurfaceVariant,
          letterSpacing = 1.sp
        )
        Text(
          "Namaste, Rahul",
          fontFamily = FontFamily.Serif,
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = HeritageOnSurface
        )
      }
      Surface(
        shape = RoundedCornerShape(20.dp),
        color = HeritageSurfaceVariant,
        border = BorderStroke(1.dp, HeritageOutline)
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("📍 Indore", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = HeritageOnSurface)
          Text(" • ", fontSize = 10.sp, color = HeritageOnSurfaceVariant)
          Text("☀️ 28°C", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = HeritageOnSurfaceVariant)
        }
      }
    }

    Spacer(modifier = Modifier.height(10.dp))

    // Documentary Reel Hero
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(230.dp)
        .background(Color.Black)
    ) {
      AsyncImage(
        model = "https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80",
        contentDescription = "Documentary Reel",
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop
      )
      Box(
        modifier = Modifier
          .fillMaxSize()
          .background(
            Brush.verticalGradient(
              colors = listOf(Color.Black.copy(alpha = 0.5f), Color.Transparent, Color.Black.copy(alpha = 0.75f))
            )
          )
      )

      // Top badges
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = Color.Black.copy(alpha = 0.5f),
          border = BorderStroke(1.dp, Color.White.copy(alpha = 0.2f))
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(HeritageGold)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              "DOCUMENTARY REEL • LIVE LOOP",
              fontSize = 8.sp,
              fontWeight = FontWeight.Bold,
              color = Color.White
            )
          }
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
          IconButton(
            onClick = { isMuted = !isMuted },
            modifier = Modifier
              .size(28.dp)
              .background(Color.Black.copy(alpha = 0.5f), CircleShape)
          ) {
            Icon(
              imageVector = if (isMuted) Icons.Filled.VolumeMute else Icons.Filled.VolumeUp,
              contentDescription = "Audio",
              tint = Color.White,
              modifier = Modifier.size(16.dp)
            )
          }
          Spacer(modifier = Modifier.width(6.dp))
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color.Black.copy(alpha = 0.5f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.2f))
          ) {
            Text(
              "4K HDR",
              fontSize = 9.sp,
              fontWeight = FontWeight.Bold,
              color = Color.White,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }
        }
      }

      // Center Play Button
      IconButton(
        onClick = { onSelectMonument("rajwada-palace") },
        modifier = Modifier
          .align(Alignment.Center)
          .size(54.dp)
          .background(Color.White.copy(alpha = 0.25f), CircleShape)
          .border(1.dp, Color.White.copy(alpha = 0.4f), CircleShape)
      ) {
        Box(
          modifier = Modifier
            .size(40.dp)
            .background(Color.White, CircleShape),
          contentAlignment = Alignment.Center
        ) {
          Icon(Icons.Filled.PlayArrow, contentDescription = "Play", tint = HeritageTerracotta)
        }
      }

      // Bottom Reel Info
      Column(
        modifier = Modifier
          .align(Alignment.BottomStart)
          .fillMaxWidth()
          .padding(start = 16.dp, end = 16.dp, bottom = 12.dp)
      ) {
        Text(
          "✨ INDORE • ARCHITECTURAL LEGACY",
          fontSize = 10.sp,
          fontWeight = FontWeight.Bold,
          color = HeritageGold,
          letterSpacing = 1.sp
        )
        Text(
          "Rajwada Palace & The Royal Heart",
          fontFamily = FontFamily.Serif,
          fontSize = 18.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
        Text(
          "Cinematic visual chronicle of the 7-story Maratha fortress & living heritage",
          fontSize = 10.sp,
          color = Color.White.copy(alpha = 0.85f),
          maxLines = 1
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
          chapters.forEachIndexed { index, chap ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = if (activeChapter == index) HeritageTerracotta else Color.White.copy(alpha = 0.2f),
              modifier = Modifier.clickable { activeChapter = index }
            ) {
              Text(
                chap,
                fontSize = 9.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
              )
            }
          }
        }
      }

      // Progress Bar
      Box(
        modifier = Modifier
          .align(Alignment.BottomStart)
          .fillMaxWidth()
          .height(3.dp)
          .background(Color.White.copy(alpha = 0.2f))
      ) {
        Box(
          modifier = Modifier
            .fillMaxWidth(0.65f)
            .fillMaxHeight()
            .background(HeritageGold)
        )
      }
    }

    Spacer(modifier = Modifier.height(20.dp))

    // Section 1: Popular Monuments
    SectionHeader("popular Monumnets", onSeeAll = onSeeAllMonuments)
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      items(HeritageDataSource.monuments.take(2)) { item ->
        MonumentCard(item = item, onClick = { onSelectMonument(item.id) })
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // Section 2: Hidden Places
    SectionHeader("Hidden Places", onSeeAll = onSeeAllMonuments)
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      val hidden = HeritageDataSource.monuments.filter { it.category == "Nature" || it.category == "Ancient History" }
      items(hidden) { item ->
        MonumentCard(item = item, onClick = { onSelectMonument(item.id) })
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // Section 3: Cultural & Markets
    SectionHeader("Cultural & Markets", onSeeAll = onSeeAllMonuments)
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      items(HeritageDataSource.markets) { item ->
        MarketCard(item = item, onClick = { onSelectMarket(item.id) })
      }
    }

    Spacer(modifier = Modifier.height(32.dp))
    }

    // Small circle floating button with Quick / Chatbot symbol
    FloatingActionButton(
      onClick = onNavigateToMoreApps,
      shape = CircleShape,
      containerColor = HeritageTerracotta,
      contentColor = Color.White,
      elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 8.dp),
      modifier = Modifier
        .align(Alignment.BottomEnd)
        .padding(bottom = 20.dp, end = 20.dp)
        .size(58.dp)
        .testTag("quick_apps_fab")
    ) {
      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
      ) {
        Icon(
          imageVector = Icons.Filled.Chat,
          contentDescription = "Quick Services",
          modifier = Modifier.size(20.dp),
          tint = Color.White
        )
        Text(
          text = "Quick",
          fontSize = 10.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White,
          letterSpacing = 0.5.sp
        )
      }
    }
  }
}

@Composable
fun SectionHeader(title: String, onSeeAll: () -> Unit) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 20.dp, vertical = 8.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Text(
      title,
      fontFamily = FontFamily.Serif,
      fontSize = 20.sp,
      fontWeight = FontWeight.Bold,
      color = HeritageOnSurface
    )
    Text(
      "See all ›",
      fontSize = 12.sp,
      fontWeight = FontWeight.Bold,
      color = HeritageOnSurfaceVariant,
      modifier = Modifier.clickable { onSeeAll() }
    )
  }
}

@Composable
fun MonumentCard(item: MonumentModel, onClick: () -> Unit) {
  Card(
    shape = RoundedCornerShape(20.dp),
    modifier = Modifier
      .width(210.dp)
      .height(270.dp)
      .clickable { onClick() },
    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
  ) {
    Box(modifier = Modifier.fillMaxSize()) {
      AsyncImage(
        model = item.imageUrl,
        contentDescription = item.name,
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop
      )
      Box(
        modifier = Modifier
          .fillMaxSize()
          .background(
            Brush.verticalGradient(
              colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
            )
          )
      )

      // Top Tag
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color.White.copy(alpha = 0.9f),
        modifier = Modifier
          .padding(12.dp)
          .align(Alignment.TopStart)
      ) {
        Text(
          item.categoryTag,
          fontSize = 10.sp,
          fontWeight = FontWeight.SemiBold,
          color = HeritageOnSurface,
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
      }

      // Bottom Info
      Column(
        modifier = Modifier
          .align(Alignment.BottomStart)
          .padding(14.dp)
      ) {
        Text(
          item.name,
          fontFamily = FontFamily.Serif,
          fontSize = 18.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
        Text("📍 ${item.city}", fontSize = 11.sp, color = Color.White.copy(alpha = 0.85f))
        Text(
          item.description,
          fontSize = 10.sp,
          color = Color.White.copy(alpha = 0.7f),
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )
      }
    }
  }
}

@Composable
fun MarketCard(item: MarketModel, onClick: () -> Unit) {
  Card(
    shape = RoundedCornerShape(20.dp),
    modifier = Modifier
      .width(210.dp)
      .height(270.dp)
      .clickable { onClick() },
    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
  ) {
    Box(modifier = Modifier.fillMaxSize()) {
      AsyncImage(
        model = item.imageUrl,
        contentDescription = item.name,
        modifier = Modifier.fillMaxSize(),
        contentScale = ContentScale.Crop
      )
      Box(
        modifier = Modifier
          .fillMaxSize()
          .background(
            Brush.verticalGradient(
              colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
            )
          )
      )

      Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color.White.copy(alpha = 0.9f),
        modifier = Modifier
          .padding(12.dp)
          .align(Alignment.TopStart)
      ) {
        Text(
          item.category,
          fontSize = 10.sp,
          fontWeight = FontWeight.SemiBold,
          color = HeritageOnSurface,
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
      }

      Column(
        modifier = Modifier
          .align(Alignment.BottomStart)
          .padding(14.dp)
      ) {
        Text(
          item.name,
          fontFamily = FontFamily.Serif,
          fontSize = 18.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
        Text("📍 ${item.city}", fontSize = 11.sp, color = Color.White.copy(alpha = 0.85f))
        Text(
          item.description,
          fontSize = 10.sp,
          color = Color.White.copy(alpha = 0.7f),
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------
// 2. SEARCH SCREEN (Stitch Image 7)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeSearchScreen(
  onOpenDrawer: () -> Unit,
  onSelectMonument: (String) -> Unit,
  favorites: Set<String>,
  onToggleFavorite: (String) -> Unit
) {
  var searchQuery by remember { mutableStateOf("") }
  var selectedCategory by remember { mutableStateOf("Popular") }
  val categories = listOf("Popular", "Hidden", "Market", "Ashram", "Restaurant", "Artisan")

  val filtered = HeritageDataSource.monuments.filter {
    (searchQuery.isEmpty() || it.name.contains(searchQuery, ignoreCase = true) || it.city.contains(searchQuery, ignoreCase = true)) &&
      (selectedCategory == "Popular" || it.category.contains(selectedCategory, ignoreCase = true) || it.categoryTag.contains(selectedCategory, ignoreCase = true))
  }

  Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
    // Top Bar
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onOpenDrawer) {
        Icon(Icons.Filled.Menu, contentDescription = "Menu", tint = HeritageOnSurface)
      }
      Text(
        "Indian Heritage",
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        color = HeritageTerracotta
      )
      IconButton(onClick = {}) {
        Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Favorites", tint = HeritageTerracotta)
      }
    }

    // Search Box
    Surface(
      shape = RoundedCornerShape(28.dp),
      color = HeritageSurfaceVariant,
      border = BorderStroke(1.dp, HeritageOutline),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 6.dp)
        .height(50.dp)
    ) {
      Row(
        modifier = Modifier
          .fillMaxSize()
          .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Icon(Icons.Filled.Search, contentDescription = "Search", tint = HeritageOnSurfaceVariant)
        Spacer(modifier = Modifier.width(8.dp))
        Box(modifier = Modifier.weight(1f)) {
          if (searchQuery.isEmpty()) {
            Text("Search places, cities, markets...", fontSize = 14.sp, color = HeritageTextMuted)
          }
          androidx.compose.foundation.text.BasicTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
          )
        }
        Icon(Icons.Outlined.Tune, contentDescription = "Filter", tint = HeritageOnSurfaceVariant)
      }
    }

    // Category Filter Chips
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      items(categories) { cat ->
        val isSelected = selectedCategory == cat
        Surface(
          shape = RoundedCornerShape(20.dp),
          color = if (isSelected) HeritageOnSurface else HeritageSurfaceVariant,
          modifier = Modifier.clickable { selectedCategory = cat }
        ) {
          Text(
            cat,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (isSelected) Color.White else HeritageOnSurface,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
          )
        }
      }
    }

    // Results Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 8.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.Bottom
    ) {
      Text(
        if (selectedCategory == "Popular") "Popular Places" else "$selectedCategory Places",
        fontFamily = FontFamily.Serif,
        fontSize = 22.sp,
        fontWeight = FontWeight.Bold,
        color = HeritageOnSurface
      )
      Text("24 places", fontSize = 13.sp, color = HeritageOnSurfaceVariant)
    }

    // Results List
    Column(
      modifier = Modifier.padding(horizontal = 20.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      filtered.forEach { item ->
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, HeritageOutline),
          modifier = Modifier
            .fillMaxWidth()
            .height(136.dp)
            .clickable { onSelectMonument(item.id) }
        ) {
          Row(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
              model = item.imageUrl,
              contentDescription = item.name,
              modifier = Modifier
                .width(124.dp)
                .fillMaxHeight(),
              contentScale = ContentScale.Crop
            )
            Column(
              modifier = Modifier
                .weight(1f)
                .padding(12.dp),
              verticalArrangement = Arrangement.SpaceBetween
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Surface(
                  shape = RoundedCornerShape(10.dp),
                  color = HeritageSurfaceVariant
                ) {
                  Text(
                    item.categoryTag,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = HeritageOnSurface,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                  )
                }
                IconButton(
                  onClick = { onToggleFavorite(item.id) },
                  modifier = Modifier.size(24.dp)
                ) {
                  val isFav = favorites.contains(item.id)
                  Icon(
                    imageVector = if (isFav) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                    contentDescription = "Fav",
                    tint = if (isFav) Color(0xFFBA1A1A) else Color(0xFF8D706C),
                    modifier = Modifier.size(18.dp)
                  )
                }
              }
              Text(
                item.name,
                fontFamily = FontFamily.Serif,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = HeritageOnSurface,
                maxLines = 1
              )
              Text("📍 ${item.city}, ${item.state}", fontSize = 11.sp, color = HeritageOnSurfaceVariant)
              Text(
                item.description,
                fontSize = 11.sp,
                color = HeritageOnSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
              )
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(32.dp))
  }
}

// -------------------------------------------------------------------------------------------------
// 3. NEARBY / MAP SCREEN (Stitch Image 9)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeNearbyScreen(onSelectMonument: (String) -> Unit) {
  var selectedPin by remember { mutableStateOf("rajwada-palace") }
  val nearby = HeritageDataSource.monuments.filter { it.distanceKm in 0.1..10.0 }
  val categories = listOf("Popular", "Hidden Gems", "Hotels", "Restaurants", "Ashrams", "Artisans")

  Box(modifier = Modifier.fillMaxSize().background(HeritageBackground)) {
    // Canvas Map Background Representation
    Canvas(modifier = Modifier.fillMaxSize()) {
      drawCircle(
        color = Color(0xFF005875).copy(alpha = 0.08f),
        radius = 240f,
        center = androidx.compose.ui.geometry.Offset(size.width * 0.4f, size.height * 0.45f)
      )
    }

    // Centered User Pulse Pin
    Box(
      modifier = Modifier
        .align(Alignment.Center)
        .offset(x = (-30).dp, y = (-20).dp),
      contentAlignment = Alignment.Center
    ) {
      Box(
        modifier = Modifier
          .size(44.dp)
          .clip(CircleShape)
          .background(HeritageTerracotta.copy(alpha = 0.2f)),
        contentAlignment = Alignment.Center
      ) {
        Box(
          modifier = Modifier
            .size(14.dp)
            .clip(CircleShape)
            .background(HeritageTerracotta)
            .border(2.dp, Color.White, CircleShape)
        )
      }
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = Color.White.copy(alpha = 0.9f),
        modifier = Modifier.offset(y = 28.dp)
      ) {
        Text("Indore", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
      }
    }

    // Rajwada Castle Marker Pin with Tooltip
    Box(
      modifier = Modifier
        .align(Alignment.Center)
        .offset(x = 60.dp, y = (-80).dp),
      contentAlignment = Alignment.Center
    ) {
      Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Surface(
          shape = RoundedCornerShape(10.dp),
          color = Color.White,
          border = BorderStroke(1.dp, HeritageOutline),
          shadowElevation = 4.dp
        ) {
          Column(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text("Rajwada Palace", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
            Text("Heritage Site", fontSize = 9.sp, color = HeritageOnSurfaceVariant)
          }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Box(
          modifier = Modifier
            .size(42.dp)
            .clip(CircleShape)
            .background(Color(0xFFC0392B))
            .border(3.dp, Color.White, CircleShape)
            .clickable { selectedPin = "rajwada-palace" },
          contentAlignment = Alignment.Center
        ) {
          Icon(Icons.Filled.Castle, contentDescription = "Palace", tint = Color.White, modifier = Modifier.size(22.dp))
        }
      }
    }

    // Top Search & Category Float
    Column(
      modifier = Modifier
        .align(Alignment.TopCenter)
        .fillMaxWidth()
        .padding(16.dp)
    ) {
      Surface(
        shape = RoundedCornerShape(28.dp),
        color = Color.White,
        border = BorderStroke(1.dp, HeritageOutline),
        shadowElevation = 4.dp,
        modifier = Modifier.fillMaxWidth().height(48.dp)
      ) {
        Row(
          modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(Icons.Filled.Search, contentDescription = "Search", tint = HeritageOnSurfaceVariant)
          Spacer(modifier = Modifier.width(8.dp))
          Text("Search nearby places...", fontSize = 13.sp, color = HeritageTextMuted, modifier = Modifier.weight(1f))
          Icon(Icons.Outlined.Tune, contentDescription = "Settings", tint = HeritageOnSurfaceVariant)
        }
      }

      Spacer(modifier = Modifier.height(8.dp))

      LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(categories) { cat ->
          Surface(
            shape = RoundedCornerShape(18.dp),
            color = if (cat == "Popular") HeritageOnSurface else Color.White,
            border = BorderStroke(1.dp, HeritageOutline),
            shadowElevation = 2.dp
          ) {
            Text(
              cat,
              fontSize = 11.sp,
              fontWeight = FontWeight.SemiBold,
              color = if (cat == "Popular") Color.White else HeritageOnSurface,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
            )
          }
        }
      }
    }

    // Right Float Controls
    Column(
      modifier = Modifier
        .align(Alignment.CenterEnd)
        .padding(end = 16.dp),
      verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
      Surface(
        shape = CircleShape,
        color = Color.White,
        border = BorderStroke(1.dp, HeritageOutline),
        shadowElevation = 4.dp,
        modifier = Modifier.size(44.dp)
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(Icons.Filled.MyLocation, contentDescription = "Locate", tint = HeritageOnSurface)
        }
      }
      Surface(
        shape = RoundedCornerShape(22.dp),
        color = Color.White,
        border = BorderStroke(1.dp, HeritageOutline),
        shadowElevation = 4.dp,
        modifier = Modifier.width(44.dp)
      ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Box(modifier = Modifier.size(44.dp, 38.dp).clickable {}, contentAlignment = Alignment.Center) {
            Text("+", fontSize = 20.sp, fontWeight = FontWeight.Bold)
          }
          HorizontalDivider(modifier = Modifier.width(28.dp), color = HeritageOutline)
          Box(modifier = Modifier.size(44.dp, 38.dp).clickable {}, contentAlignment = Alignment.Center) {
            Text("−", fontSize = 20.sp, fontWeight = FontWeight.Bold)
          }
        }
      }
    }

    // Bottom Carousel Cards
    Box(
      modifier = Modifier
        .align(Alignment.BottomCenter)
        .fillMaxWidth()
        .padding(bottom = 12.dp)
    ) {
      LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp)
      ) {
        items(nearby) { place ->
          Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.width(290.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
          ) {
            Column {
              Box(modifier = Modifier.fillMaxWidth().height(160.dp)) {
                AsyncImage(
                  model = place.imageUrl,
                  contentDescription = place.name,
                  modifier = Modifier.fillMaxSize(),
                  contentScale = ContentScale.Crop
                )
                Box(
                  modifier = Modifier
                    .fillMaxSize()
                    .background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f))))
                )
                Surface(
                  shape = RoundedCornerShape(10.dp),
                  color = Color.White.copy(alpha = 0.92f),
                  modifier = Modifier.padding(10.dp).align(Alignment.TopStart)
                ) {
                  Text("🏛️ ${place.category}", fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                }
                Column(modifier = Modifier.align(Alignment.BottomStart).padding(12.dp)) {
                  Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(place.name, fontFamily = FontFamily.Serif, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Surface(shape = RoundedCornerShape(6.dp), color = Color.Black.copy(alpha = 0.5f)) {
                      Text("★ ${place.rating}", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageGold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                  }
                  Text("📍 ${place.distanceKm} km away • ${place.city}", fontSize = 10.sp, color = Color.White.copy(alpha = 0.85f))
                }
              }
              Row(modifier = Modifier.fillMaxWidth().padding(10.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                  onClick = {},
                  colors = ButtonDefaults.buttonColors(containerColor = HeritageTerracotta),
                  shape = RoundedCornerShape(8.dp),
                  modifier = Modifier.weight(1f).height(38.dp)
                ) {
                  Text("↗ Directions", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                OutlinedButton(
                  onClick = { onSelectMonument(place.id) },
                  colors = ButtonDefaults.outlinedButtonColors(contentColor = HeritageTerracotta),
                  border = BorderStroke(1.dp, HeritageTerracotta),
                  shape = RoundedCornerShape(8.dp),
                  modifier = Modifier.weight(1f).height(38.dp)
                ) {
                  Text("🧭 Visit", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
              }
            }
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------
// 4. EXPLORE SCREEN (Stitch Image 13)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeExploreScreen(
  onOpenDrawer: () -> Unit,
  onSelectMonument: (String) -> Unit,
  onOpenSearch: () -> Unit
) {
  var activeCategory by remember { mutableStateOf("All") }
  val categories = listOf("All", "Popular Places", "Hidden Gems", "Heritage", "Markets", "Culture")

  Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
    // Header Row
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onOpenDrawer) {
        Icon(Icons.Filled.Menu, contentDescription = "Menu", tint = HeritageOnSurface)
      }
      Text("Indian Heritage", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = HeritageTerracotta)
      IconButton(onClick = {}) {
        Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Favorites", tint = HeritageTerracotta)
      }
    }

    // Title Section
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 12.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column(modifier = Modifier.weight(1f)) {
        Text("Explore India", fontFamily = FontFamily.Serif, fontSize = 26.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
        Text("Discover places, culture, markets and hidden gems across India.", fontSize = 12.sp, color = HeritageOnSurfaceVariant)
      }
      IconButton(
        onClick = onOpenSearch,
        modifier = Modifier.size(40.dp).background(HeritageSurfaceVariant, CircleShape)
      ) {
        Icon(Icons.Filled.Search, contentDescription = "Search", tint = HeritageOnSurface)
      }
    }

    // Chips
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      items(categories) { cat ->
        val isSel = activeCategory == cat
        Surface(
          shape = RoundedCornerShape(20.dp),
          color = if (isSel) HeritageOnSurface else HeritageSurfaceVariant,
          border = BorderStroke(1.dp, HeritageOutline),
          modifier = Modifier.clickable { activeCategory = cat }
        ) {
          Text(
            cat,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (isSel) Color.White else HeritageOnSurface,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // Featured Destination Banner
    Card(
      shape = RoundedCornerShape(18.dp),
      modifier = Modifier
        .fillMaxWidth()
        .height(250.dp)
        .padding(horizontal = 20.dp)
        .clickable { onSelectMonument("rajwada-palace") }
    ) {
      Box(modifier = Modifier.fillMaxSize()) {
        AsyncImage(
          model = "https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80",
          contentDescription = "Madhya Pradesh",
          modifier = Modifier.fillMaxSize(),
          contentScale = ContentScale.Crop
        )
        Box(
          modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f))))
        )
        Column(
          modifier = Modifier
            .align(Alignment.BottomStart)
            .padding(16.dp)
        ) {
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = Color.White.copy(alpha = 0.2f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.4f))
          ) {
            Text("FEATURED DESTINATION", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.White, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
          }
          Spacer(modifier = Modifier.height(4.dp))
          Text("Discover Madhya Pradesh", fontFamily = FontFamily.Serif, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.White)
          Text(
            "The heart of India offers an unparalleled journey through time, featuring ancient temples, majestic forts, and rich cultural traditions.",
            fontSize = 11.sp,
            color = Color.White.copy(alpha = 0.85f),
            maxLines = 2
          )
          Spacer(modifier = Modifier.height(6.dp))
          Text("Explore →", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // Popular Places Horizontal
    SectionHeader("Popular Places", onSeeAll = onOpenSearch)
    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      val places = listOf(
        Triple("Rajwada Palace", "Indore, MP", "https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80"),
        Triple("Taj Mahal Environs", "Agra, UP", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"),
        Triple("Dashashwamedh Ghat", "Varanasi, UP", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80")
      )
      items(places) { (name, loc, img) ->
        Card(
          shape = RoundedCornerShape(16.dp),
          modifier = Modifier
            .width(200.dp)
            .height(280.dp)
            .clickable { onSelectMonument("rajwada-palace") },
          elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
          Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(model = img, contentDescription = name, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
            Box(modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f)))))
            Column(modifier = Modifier.align(Alignment.BottomStart).padding(14.dp)) {
              Text(loc.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White.copy(alpha = 0.85f))
              Text(name, fontFamily = FontFamily.Serif, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(32.dp))
  }
}

// -------------------------------------------------------------------------------------------------
// 5. HERITAGE PASSPORT / PROFILE SCREEN (Stitch Image 17)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposePassportScreen(
  onOpenDrawer: () -> Unit,
  onNavigateToMoreApps: () -> Unit,
  visitedSiteIds: Set<String> = setOf("rajwada-palace", "lal-bagh-palace"),
  onSelectMonument: (String) -> Unit = {}
) {
  var isEditing by remember { mutableStateOf(false) }
  var activeFilter by remember { mutableStateOf("all") } // "all", "visited", "unvisited"
  var selectedStampMonument by remember { mutableStateOf<MonumentModel?>(null) }

  val allMonuments = HeritageDataSource.monuments
  val visitedMonuments = allMonuments.filter { visitedSiteIds.contains(it.id) }
  val unvisitedMonuments = allMonuments.filter { !visitedSiteIds.contains(it.id) }

  val displayedMonuments = when (activeFilter) {
    "visited" -> visitedMonuments
    "unvisited" -> unvisitedMonuments
    else -> allMonuments
  }

  val totalSites = allMonuments.size
  val visitedCount = visitedSiteIds.size
  val progressPercent = if (totalSites > 0) (visitedCount * 100) / totalSites else 0

  val rankTitle = when {
    visitedCount >= 5 -> "Grand Heritage Laureate 🏆"
    visitedCount >= 3 -> "Master Chronicler 📜"
    visitedCount >= 2 -> "Senior Explorer 🧭"
    visitedCount >= 1 -> "Heritage Pioneer 🏛️"
    else -> "Aspiring Explorer 🎒"
  }

  // Stamp Details Dialog
  if (selectedStampMonument != null) {
    val m = selectedStampMonument!!
    val isCollected = visitedSiteIds.contains(m.id)
    AlertDialog(
      onDismissRequest = { selectedStampMonument = null },
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Text("🏛️", fontSize = 22.sp)
          Spacer(modifier = Modifier.width(8.dp))
          Column {
            Text(
              "ARCHAEOLOGICAL SURVEY OF INDIA",
              fontSize = 9.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF9E2016),
              letterSpacing = 1.sp
            )
            Text(
              "Official Heritage Stamp",
              fontFamily = FontFamily.Serif,
              fontWeight = FontWeight.Bold,
              fontSize = 17.sp,
              color = Color(0xFF1E293B)
            )
          }
        }
      },
      text = {
        Column {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(130.dp)
              .clip(RoundedCornerShape(12.dp))
          ) {
            AsyncImage(
              model = m.imageUrl,
              contentDescription = m.name,
              modifier = Modifier.fillMaxSize(),
              contentScale = ContentScale.Crop
            )
            Surface(
              shape = RoundedCornerShape(topStart = 0.dp, bottomEnd = 8.dp),
              color = Color(0xFF9E2016),
              modifier = Modifier.align(Alignment.TopStart)
            ) {
              Text(
                if (isCollected) "✓ OFFICIAL STAMP" else "UNVISITED SITE",
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(12.dp))
          Text(m.name, fontFamily = FontFamily.Serif, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
          Text("📍 ${m.city}, ${m.state}", fontSize = 12.sp, color = Color(0xFF64748B))

          Spacer(modifier = Modifier.height(8.dp))
          Text(
            m.description,
            fontSize = 12.sp,
            color = Color(0xFF334155),
            lineHeight = 16.sp,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis
          )

          Spacer(modifier = Modifier.height(10.dp))
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0xFFFEF2F2),
            border = BorderStroke(1.dp, Color(0xFFFECACA)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(8.dp)) {
              Text("PASSPORT CERTIFICATION", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF9E2016))
              Text("Serial: IH-${m.id.uppercase().take(8)}-2026", fontSize = 10.sp, color = Color(0xFF475569))
              Text("Status: ${if (isCollected) "Verified Entry • Inked in Book" else "Pending Visit"}", fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = if (isCollected) Color(0xFF047857) else Color(0xFFB45309))
            }
          }
        }
      },
      confirmButton = {
        Button(
          onClick = {
            val id = m.id
            selectedStampMonument = null
            onSelectMonument(id)
          },
          colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9E2016)),
          shape = RoundedCornerShape(8.dp)
        ) {
          Text("Open Place Profile ↗", fontWeight = FontWeight.Bold, fontSize = 11.sp)
        }
      },
      dismissButton = {
        TextButton(onClick = { selectedStampMonument = null }) {
          Text("Close", color = Color(0xFF64748B), fontSize = 12.sp)
        }
      }
    )
  }

  Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
    // Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onOpenDrawer) {
        Icon(Icons.Filled.Menu, contentDescription = "Menu", tint = HeritageOnSurface)
      }
      Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Heritage Passport", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = HeritageOnSurface)
        Text("OFFICIAL CITIZEN LOGBOOK", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = HeritageOnSurfaceVariant, letterSpacing = 1.sp)
      }
      IconButton(onClick = {}) {
        Icon(Icons.Outlined.Settings, contentDescription = "Settings", tint = HeritageOnSurfaceVariant)
      }
    }

    // 1. DIGITAL PASSPORT ID LEATHER BOOK (Stitch / Custom Gold Passport Aesthetic)
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
      border = BorderStroke(2.dp, Color(0xFFD4AF37)),
      elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        // Document Header with Gold Foil details
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.Top
        ) {
          Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Text("🏛️", fontSize = 18.sp)
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                "REPUBLIC OF INDIA • BHARAT",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFD4AF37),
                letterSpacing = 1.sp
              )
            }
            Text(
              "DIGITAL HERITAGE PASSPORT",
              fontSize = 14.sp,
              fontWeight = FontWeight.ExtraBold,
              color = Color.White,
              letterSpacing = 0.5.sp
            )
            Text(
              "ARCHAEOLOGICAL SURVEY OF INDIA",
              fontSize = 9.sp,
              color = Color(0xFF94A3B8),
              letterSpacing = 0.8.sp
            )
          }

          Box(contentAlignment = Alignment.BottomEnd) {
            Box(
              modifier = Modifier
                .size(62.dp)
                .clip(CircleShape)
                .border(2.dp, Color(0xFFD4AF37), CircleShape)
            ) {
              AsyncImage(
                model = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
                contentDescription = "Avatar",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
              )
            }
            Box(
              modifier = Modifier
                .size(18.dp)
                .clip(CircleShape)
                .background(Color(0xFF10B981)),
              contentAlignment = Alignment.Center
            ) {
              Text("✓", fontSize = 10.sp, color = Color.White, fontWeight = FontWeight.Bold)
            }
          }
        }

        Spacer(modifier = Modifier.height(12.dp))
        Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Color(0xFF334155)))
        Spacer(modifier = Modifier.height(12.dp))

        // Passport Holder Particulars
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Column {
            Text("PASSPORT BEARER", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
            Text("Rahul Sharma", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("📍 Indore, Madhya Pradesh", fontSize = 11.sp, color = Color(0xFFCBD5E1))
          }

          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color(0xFF1E293B),
            border = BorderStroke(1.dp, Color(0xFFD4AF37))
          ) {
            Text(
              rankTitle,
              fontSize = 11.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFFFDE68A),
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Live Progress Track
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            "STAMP COLLECTION PROGRESS",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFD4AF37),
            letterSpacing = 0.5.sp
          )
          Text(
            "$visitedCount of $totalSites Sites ($progressPercent%)",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
          )
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Progress Bar
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(8.dp)
            .clip(RoundedCornerShape(4.dp))
            .background(Color(0xFF334155))
        ) {
          Box(
            modifier = Modifier
              .fillMaxWidth(if (totalSites > 0) visitedCount.toFloat() / totalSites else 0f)
              .fillMaxHeight()
              .clip(RoundedCornerShape(4.dp))
              .background(
                Brush.horizontalGradient(
                  listOf(Color(0xFFD4AF37), Color(0xFFF59E0B), Color(0xFFE11D48))
                )
              )
          )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("PASSPORT NO: IH-IND-2026-9842", fontSize = 10.sp, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
          Text(
            if (isEditing) "Saved ✓" else "Edit Details",
            fontSize = 11.sp,
            color = Color(0xFFD4AF37),
            fontWeight = FontWeight.Bold,
            modifier = Modifier.clickable { isEditing = !isEditing }
          )
        }
      }
    }

    // 2. Statistics Grid
    Card(
      shape = RoundedCornerShape(16.dp),
      colors = CardDefaults.cardColors(containerColor = Color.White),
      border = BorderStroke(1.dp, HeritageOutline),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
      ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text("$visitedCount", fontFamily = FontFamily.Serif, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF9E2016))
          Text("Stamps Inked", fontSize = 11.sp, color = HeritageOnSurfaceVariant)
        }
        Box(modifier = Modifier.width(1.dp).height(36.dp).background(HeritageOutline))
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text("${totalSites - visitedCount}", fontFamily = FontFamily.Serif, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
          Text("Sites Left", fontSize = 11.sp, color = HeritageOnSurfaceVariant)
        }
        Box(modifier = Modifier.width(1.dp).height(36.dp).background(HeritageOutline))
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text("${HeritageDataSource.badges.size}", fontFamily = FontFamily.Serif, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB45309))
          Text("Guild Badges", fontSize = 11.sp, color = HeritageOnSurfaceVariant)
        }
      }
    }

    Spacer(modifier = Modifier.height(10.dp))

    // 3. VIRTUAL STAMPS COLLECTION COMPONENT
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color.White),
      border = BorderStroke(1.dp, HeritageOutline),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        // Component Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Column {
            Text("Collected Virtual Stamps", fontFamily = FontFamily.Serif, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
            Text("Official ASI ink seals from your visits", fontSize = 11.sp, color = HeritageOnSurfaceVariant)
          }
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color(0xFFFEF2F2),
            border = BorderStroke(1.dp, Color(0xFFFECACA))
          ) {
            Text(
              "$visitedCount STAMPS",
              fontSize = 11.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF9E2016),
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Filter Tabs
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          listOf(
            "all" to "All Sites (${totalSites})",
            "visited" to "Collected (${visitedCount})",
            "unvisited" to "Unexplored (${totalSites - visitedCount})"
          ).forEach { (key, label) ->
            val isSelected = activeFilter == key
            Surface(
              shape = RoundedCornerShape(20.dp),
              color = if (isSelected) Color(0xFF0F172A) else Color(0xFFF1F5F9),
              border = BorderStroke(1.dp, if (isSelected) Color(0xFF0F172A) else Color(0xFFE2E8F0)),
              modifier = Modifier.clickable { activeFilter = key }
            ) {
              Text(
                label,
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) Color.White else Color(0xFF475569),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Stamps List / Grid
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
          displayedMonuments.forEachIndexed { index, monument ->
            val isVisited = visitedSiteIds.contains(monument.id)

            // Ink color variations for authentic rubber-stamp feel
            val stampColor = when (index % 4) {
              0 -> Color(0xFF9E2016) // Terracotta Red
              1 -> Color(0xFF1E3A8A) // Imperial Navy
              2 -> Color(0xFF065F46) // Forest Emerald
              else -> Color(0xFF92400E) // Heritage Ochre
            }
            val stampBg = when (index % 4) {
              0 -> Color(0xFFFEF2F2)
              1 -> Color(0xFFEFF6FF)
              2 -> Color(0xFFECFDF5)
              else -> Color(0xFFFFFBEB)
            }
            val subtleRotation = when (index % 3) {
              0 -> -1.5f
              1 -> 1.8f
              else -> -0.8f
            }

            if (isVisited) {
              // COLLECTED VIRTUAL STAMP (Physical rubber stamp look)
              Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = stampBg),
                border = BorderStroke(1.8.dp, stampColor),
                modifier = Modifier
                  .fillMaxWidth()
                  .rotate(subtleRotation)
                  .clickable { selectedStampMonument = monument }
              ) {
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  // Stamp Badge Ring
                  Box(
                    modifier = Modifier
                      .size(56.dp)
                      .clip(CircleShape)
                      .border(2.dp, stampColor, CircleShape)
                      .padding(3.dp)
                      .border(1.dp, stampColor, CircleShape),
                    contentAlignment = Alignment.Center
                  ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                      Text("★ ASI ★", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = stampColor)
                      Text(
                        if (monument.category.contains("Palace", ignoreCase = true)) "🏰" else if (monument.category.contains("Temple", ignoreCase = true)) "🛕" else "🏛️",
                        fontSize = 16.sp
                      )
                      Text("ENTRY", fontSize = 7.sp, fontWeight = FontWeight.ExtraBold, color = stampColor)
                    }
                  }

                  Spacer(modifier = Modifier.width(12.dp))

                  // Stamp Details
                  Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      Text(
                        monument.name,
                        fontFamily = FontFamily.Serif,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = stampColor,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                      )
                    }
                    Text(
                      "📍 ${monument.city}, ${monument.state}",
                      fontSize = 11.sp,
                      color = stampColor.copy(alpha = 0.8f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = stampColor
                      ) {
                        Text(
                          "COLLECTED ✓",
                          fontSize = 9.sp,
                          fontWeight = FontWeight.Bold,
                          color = Color.White,
                          modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                      }
                      Spacer(modifier = Modifier.width(6.dp))
                      Text(
                        "Tap to inspect ↗",
                        fontSize = 9.sp,
                        color = stampColor.copy(alpha = 0.7f),
                        fontWeight = FontWeight.SemiBold
                      )
                    }
                  }

                  // Verification Pill
                  Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color.White,
                    border = BorderStroke(1.dp, stampColor)
                  ) {
                    Text(
                      "VERIFIED",
                      fontSize = 9.sp,
                      fontWeight = FontWeight.ExtraBold,
                      color = stampColor,
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                      letterSpacing = 0.5.sp
                    )
                  }
                }
              }
            } else {
              // UNVISITED PLACE SLOT (Lock + Stamp Action)
              Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Box(
                    modifier = Modifier
                      .size(50.dp)
                      .clip(CircleShape)
                      .background(Color(0xFFE2E8F0)),
                    contentAlignment = Alignment.Center
                  ) {
                    Icon(
                      Icons.Filled.Lock,
                      contentDescription = "Unvisited",
                      tint = Color(0xFF94A3B8),
                      modifier = Modifier.size(20.dp)
                    )
                  }

                  Spacer(modifier = Modifier.width(12.dp))

                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      monument.name,
                      fontFamily = FontFamily.Serif,
                      fontSize = 14.sp,
                      fontWeight = FontWeight.SemiBold,
                      color = Color(0xFF334155),
                      maxLines = 1,
                      overflow = TextOverflow.Ellipsis
                    )
                    Text(
                      "📍 ${monument.city}, ${monument.state}",
                      fontSize = 11.sp,
                      color = Color(0xFF64748B)
                    )
                    Text(
                      "Stamp not yet collected",
                      fontSize = 10.sp,
                      color = Color(0xFF94A3B8),
                      fontStyle = FontStyle.Italic
                    )
                  }

                  OutlinedButton(
                    onClick = { onSelectMonument(monument.id) },
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, HeritageTerracotta),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = HeritageTerracotta),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                  ) {
                    Text("+ Stamp Place", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                  }
                }
              }
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(10.dp))

    // 4. Explorer Achievements / Badges Section
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 8.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text("Explorer Achievements", fontFamily = FontFamily.Serif, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
      Text("View All", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant)
    }

    LazyRow(
      contentPadding = PaddingValues(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
      items(HeritageDataSource.badges) { badge ->
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, HeritageOutline),
          modifier = Modifier.width(150.dp)
        ) {
          Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Box(contentAlignment = Alignment.BottomEnd) {
              Box(
                modifier = Modifier
                  .size(58.dp)
                  .clip(CircleShape)
                  .background(HeritageBackground)
                  .border(1.5.dp, Color(0xFFC0392B), CircleShape),
                contentAlignment = Alignment.Center
              ) {
                Icon(
                  imageVector = if (badge.icon == "fort") Icons.Filled.Castle else if (badge.icon == "temple") Icons.Filled.AccountBalance else Icons.Filled.Museum,
                  contentDescription = badge.title,
                  tint = HeritageTerracotta,
                  modifier = Modifier.size(28.dp)
                )
              }
              Box(
                modifier = Modifier
                  .size(18.dp)
                  .clip(CircleShape)
                  .background(HeritageTerracotta),
                contentAlignment = Alignment.Center
              ) {
                Text("✓", fontSize = 10.sp, color = Color.White, fontWeight = FontWeight.Bold)
              }
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(badge.title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
            Text(badge.monumentName, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = HeritageOnSurfaceVariant)
            Text(badge.location, fontSize = 9.sp, color = Color(0xFF8D706C))
            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = HeritageOutline)
            Spacer(modifier = Modifier.height(6.dp))
            Text("VERIFIED ENTRY", fontSize = 8.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFC0392B), letterSpacing = 1.sp)
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(32.dp))
  }
}

// -------------------------------------------------------------------------------------------------
// 6. MONUMENT DETAIL SCREEN (Stitch Image 5)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeMonumentDetailScreen(
  monumentId: String,
  onBack: () -> Unit,
  isFavorite: Boolean,
  onToggleFavorite: () -> Unit,
  isVisited: Boolean = false,
  onToggleVisited: () -> Unit = {},
  onNavigateToPassport: () -> Unit = {}
) {
  var isExpanded by remember { mutableStateOf(false) }
  var activeTab by remember { mutableStateOf("Video") }
  var showCelebrationDialog by remember { mutableStateOf(false) }
  val tabs = listOf("Video", "History", "Weather", "About", "Website", "Direction")

  val monument = HeritageDataSource.monuments.find { it.id == monumentId }
    ?: HeritageDataSource.monuments.first()

  if (showCelebrationDialog) {
    AlertDialog(
      onDismissRequest = { showCelebrationDialog = false },
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Text("🏛️", fontSize = 24.sp)
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            "Passport Stamped!",
            fontFamily = FontFamily.Serif,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp,
            color = Color(0xFF9E2016)
          )
        }
      },
      text = {
        Column {
          Text(
            "Congratulations! The official virtual stamp for ${monument.name} (${monument.city}, ${monument.state}) has been inked into your Digital Heritage Passport.",
            fontSize = 13.sp,
            color = Color(0xFF334155),
            lineHeight = 18.sp
          )
          Spacer(modifier = Modifier.height(10.dp))
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0xFFFEF2F2),
            border = BorderStroke(1.dp, Color(0xFFFCA5A5)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              "★ ASI VERIFIED ENTRY • STAMP SERIAL #IH-${monument.id.uppercase().take(8)}",
              fontSize = 10.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF9E2016),
              modifier = Modifier.padding(8.dp)
            )
          }
        }
      },
      confirmButton = {
        Button(
          onClick = {
            showCelebrationDialog = false
            onNavigateToPassport()
          },
          colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9E2016)),
          shape = RoundedCornerShape(8.dp)
        ) {
          Text("View in Passport ↗", fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
      },
      dismissButton = {
        TextButton(onClick = { showCelebrationDialog = false }) {
          Text("Keep Exploring", color = Color(0xFF64748B), fontSize = 12.sp)
        }
      }
    )
  }

  Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
    // Top Bar
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onBack) {
        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = HeritageOnSurface)
      }
      Text("Indian Heritage", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = HeritageTerracotta)
      IconButton(onClick = onToggleFavorite) {
        Icon(
          imageVector = if (isFavorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
          contentDescription = "Favorite",
          tint = if (isFavorite) Color(0xFFBA1A1A) else HeritageTerracotta
        )
      }
    }

    // Hero Image
    Box(modifier = Modifier.fillMaxWidth().height(220.dp)) {
      AsyncImage(model = monument.imageUrl, contentDescription = monument.name, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
    }

    // Body
    Column(modifier = Modifier.padding(20.dp)) {
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Surface(shape = RoundedCornerShape(14.dp), color = HeritageSurfaceVariant) {
          Text(monument.category.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
        }
        Surface(shape = RoundedCornerShape(14.dp), color = HeritageSurfaceVariant) {
          Text(monument.categoryTag.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface, modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp))
        }
      }

      Spacer(modifier = Modifier.height(8.dp))
      Text(monument.name, fontFamily = FontFamily.Serif, fontSize = 28.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
      Text("📍 ${monument.city}, ${monument.state}", fontSize = 13.sp, color = HeritageOnSurfaceVariant)

      Spacer(modifier = Modifier.height(10.dp))

      // Visited / Stamp Passport Action Card
      Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
          containerColor = if (isVisited) Color(0xFFFEF2F2) else Color(0xFFF8FAFC)
        ),
        border = BorderStroke(1.5.dp, if (isVisited) Color(0xFF9E2016) else Color(0xFFCBD5E1)),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(12.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
          ) {
            Box(
              modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(if (isVisited) Color(0xFF9E2016) else Color(0xFFE2E8F0)),
              contentAlignment = Alignment.Center
            ) {
              if (isVisited) {
                Icon(Icons.Filled.Check, contentDescription = "Visited", tint = Color.White, modifier = Modifier.size(20.dp))
              } else {
                Icon(Icons.Filled.BookmarkAdd, contentDescription = "Stamp", tint = Color(0xFF475569), modifier = Modifier.size(20.dp))
              }
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                if (isVisited) "VISITED • PASSPORT STAMPED" else "VISITED THIS PLACE?",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (isVisited) Color(0xFF9E2016) else Color(0xFF334155),
                letterSpacing = 0.5.sp
              )
              Text(
                if (isVisited) "Official ASI virtual stamp inked in your passport" else "Tap 'Visited' to ink stamp in your profile passport",
                fontSize = 10.sp,
                color = Color(0xFF64748B)
              )
            }
          }

          Button(
            onClick = {
              if (!isVisited) {
                onToggleVisited()
                showCelebrationDialog = true
              } else {
                onToggleVisited()
              }
            },
            colors = ButtonDefaults.buttonColors(
              containerColor = if (isVisited) Color(0xFF9E2016) else Color(0xFF0F172A)
            ),
            shape = RoundedCornerShape(10.dp),
            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
          ) {
            Text(
              if (isVisited) "Visited ✓" else "Visited +",
              fontSize = 11.sp,
              fontWeight = FontWeight.Bold,
              color = Color.White
            )
          }
        }
      }

      Spacer(modifier = Modifier.height(14.dp))

      // Quick Tabs
      LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(tabs) { tab ->
          val isSel = activeTab == tab
          Surface(
            shape = RoundedCornerShape(20.dp),
            color = if (isSel) HeritageOnSurface else HeritageSurfaceVariant,
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.clickable { activeTab = tab }
          ) {
            Text(
              tab,
              fontSize = 12.sp,
              fontWeight = FontWeight.SemiBold,
              color = if (isSel) Color.White else HeritageOnSurface,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
            )
          }
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // The Story
      Text("The Story", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
      Spacer(modifier = Modifier.height(6.dp))
      Text(
        monument.detailedStory,
        fontSize = 14.sp,
        color = HeritageOnSurfaceVariant,
        lineHeight = 22.sp,
        maxLines = if (isExpanded) 100 else 4,
        overflow = TextOverflow.Ellipsis
      )
      Text(
        if (isExpanded) "Show Less ▲" else "Discover More ▼",
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = HeritageOnSurfaceVariant,
        modifier = Modifier.clickable { isExpanded = !isExpanded }.padding(vertical = 4.dp)
      )

      Spacer(modifier = Modifier.height(20.dp))

      // Highlights
      if (monument.highlights.isNotEmpty()) {
        Text("Key Highlights", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
        Spacer(modifier = Modifier.height(10.dp))
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          monument.highlights.forEach { h ->
            Card(
              shape = RoundedCornerShape(14.dp),
              colors = CardDefaults.cardColors(containerColor = HeritageSurfaceVariant),
              border = BorderStroke(1.dp, HeritageOutline),
              modifier = Modifier.fillMaxWidth()
            ) {
              Column(modifier = Modifier.padding(14.dp)) {
                Text(h.title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
                Spacer(modifier = Modifier.height(2.dp))
                Text(h.description, fontSize = 12.sp, color = HeritageOnSurfaceVariant)
              }
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Visiting Info Card
      Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, HeritageOutline),
        modifier = Modifier.fillMaxWidth()
      ) {
        Column(modifier = Modifier.padding(20.dp)) {
          Text("Visiting Info", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
          Spacer(modifier = Modifier.height(12.dp))

          Text("🕒 Opening Hours", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
          Text(monument.openingHours, fontSize = 13.sp, color = HeritageOnSurfaceVariant)
          Text(monument.closedDays, fontSize = 11.sp, color = HeritageTextMuted)

          Spacer(modifier = Modifier.height(10.dp))
          Text("💳 Entry Fee", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
          Text(monument.entryFeeIndian, fontSize = 13.sp, color = HeritageOnSurfaceVariant)
          Text(monument.entryFeeForeigner, fontSize = 11.sp, color = HeritageTextMuted)

          Spacer(modifier = Modifier.height(10.dp))
          Text("📅 Best Time to Visit", fontSize = 12.sp, fontWeight = FontWeight.Bold)
          Text(monument.bestTime, fontSize = 13.sp, color = HeritageOnSurfaceVariant)

          Spacer(modifier = Modifier.height(16.dp))

          OutlinedButton(
            onClick = {
              if (!isVisited) {
                onToggleVisited()
                showCelebrationDialog = true
              } else {
                onToggleVisited()
              }
            },
            colors = ButtonDefaults.outlinedButtonColors(
              containerColor = if (isVisited) Color(0xFFFEF2F2) else Color.White
            ),
            border = BorderStroke(1.5.dp, if (isVisited) Color(0xFF9E2016) else HeritageTerracotta),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
          ) {
            Icon(
              imageVector = if (isVisited) Icons.Filled.CheckCircle else Icons.Filled.BookmarkAdd,
              contentDescription = null,
              tint = if (isVisited) Color(0xFF9E2016) else HeritageTerracotta,
              modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
              if (isVisited) "✓ Visited • Inked in Digital Passport" else "🔏 Visited This Place? Stamp Passport",
              fontSize = 13.sp,
              fontWeight = FontWeight.Bold,
              color = if (isVisited) Color(0xFF9E2016) else HeritageTerracotta
            )
          }

          Spacer(modifier = Modifier.height(10.dp))
          Button(
            onClick = {},
            colors = ButtonDefaults.buttonColors(containerColor = HeritageTerracotta),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
          ) {
            Text("🧭 Get Directions", fontSize = 14.sp, fontWeight = FontWeight.Bold)
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------
// 7. CULTURAL MARKET DETAIL SCREEN (Stitch Image 15)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeMarketDetailScreen(
  marketId: String,
  onBack: () -> Unit,
  isFavorite: Boolean,
  onToggleFavorite: () -> Unit
) {
  var isExpanded by remember { mutableStateOf(false) }
  val market = HeritageDataSource.markets.find { it.id == marketId }
    ?: HeritageDataSource.markets.first()

  Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
    // Top Bar
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onBack) {
        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = HeritageOnSurface)
      }
      Text("Indian Heritage", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = HeritageTerracotta)
      IconButton(onClick = onToggleFavorite) {
        Icon(
          imageVector = if (isFavorite) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
          contentDescription = "Favorite",
          tint = if (isFavorite) Color(0xFFBA1A1A) else HeritageTerracotta
        )
      }
    }

    // Hero Section with dark overlay
    Box(modifier = Modifier.fillMaxWidth().height(300.dp)) {
      AsyncImage(model = market.imageUrl, contentDescription = market.name, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
      Box(modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f)))))
      Column(modifier = Modifier.align(Alignment.BottomStart).padding(20.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          Surface(shape = RoundedCornerShape(14.dp), color = Color.White) {
            Text(market.city.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp))
          }
          Surface(shape = RoundedCornerShape(14.dp), color = Color.White) {
            Text(market.category.uppercase(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp))
          }
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(market.name, fontFamily = FontFamily.Serif, fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Text(market.subtitle, fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f))
      }
    }

    Column(modifier = Modifier.padding(20.dp)) {
      // Story
      Text("A Dual Identity", fontFamily = FontFamily.Serif, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
      Spacer(modifier = Modifier.height(6.dp))
      Text(
        market.detailedStory,
        fontSize = 14.sp,
        color = HeritageOnSurfaceVariant,
        lineHeight = 22.sp,
        maxLines = if (isExpanded) 100 else 6,
        overflow = TextOverflow.Ellipsis
      )
      Text(
        if (isExpanded) "Read Less ▲" else "Read More ▼",
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = HeritageOnSurfaceVariant,
        modifier = Modifier.clickable { isExpanded = !isExpanded }.padding(vertical = 4.dp)
      )

      Spacer(modifier = Modifier.height(20.dp))

      // Culinary Signatures
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text("🍴 ", fontSize = 18.sp)
        Text("Culinary Signatures", fontFamily = FontFamily.Serif, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
      }
      Spacer(modifier = Modifier.height(10.dp))
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        market.signatures.forEach { item ->
          Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = HeritageSurfaceVariant),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(14.dp)) {
              Text(item.title, fontFamily = FontFamily.Serif, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
              Spacer(modifier = Modifier.height(2.dp))
              Text(item.description, fontSize = 12.sp, color = HeritageOnSurfaceVariant)
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Plan Your Visit Card
      Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, HeritageOutline),
        modifier = Modifier.fillMaxWidth()
      ) {
        Column(modifier = Modifier.padding(20.dp)) {
          Text("Plan Your Visit", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
          Spacer(modifier = Modifier.height(12.dp))

          Text("🕒 MARKET HOURS", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp, color = HeritageOnSurface)
          Text(market.marketHours, fontSize = 13.sp, color = HeritageOnSurfaceVariant)
          Text(market.setupTime, fontSize = 11.sp, color = HeritageTextMuted)

          Spacer(modifier = Modifier.height(10.dp))
          Text("👥 PEAK CROWD", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
          Text(market.peakCrowd, fontSize = 13.sp, color = HeritageOnSurfaceVariant)

          Spacer(modifier = Modifier.height(10.dp))
          Text("🚗 GETTING THERE", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
          Text(market.gettingThere, fontSize = 12.sp, color = HeritageOnSurfaceVariant)

          Spacer(modifier = Modifier.height(16.dp))
          Button(
            onClick = {},
            colors = ButtonDefaults.buttonColors(containerColor = HeritageTerracotta),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
          ) {
            Text("🗺️ OPEN IN MAPS", fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
          }
        }
      }
    }
  }
}

// -------------------------------------------------------------------------------------------------
// 8. MORE APPS & COMPANION SERVICES (Citizen Tools, SOS & Companion Apps)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeMoreAppsScreen(onBack: () -> Unit) {
  var appStatusMap by remember { mutableStateOf(mapOf<String, String>()) }
  var citizenDialogType by remember { mutableStateOf<String?>(null) }
  var dialogInputText by remember { mutableStateOf("") }
  var showSubmittedToast by remember { mutableStateOf(false) }
  var sosDialDialog by remember { mutableStateOf<Pair<String, String>?>(null) }

  // Citizen Action Modal Dialog
  if (citizenDialogType != null) {
    AlertDialog(
      onDismissRequest = { citizenDialogType = null },
      title = {
        Column {
          Text(
            text = when (citizenDialogType) {
              "add_place" -> "CITIZEN CONTRIBUTION"
              "complaint" -> "CIVIC GRIEVANCE"
              else -> "HERITAGE IMPROVEMENT"
            },
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFC0392B),
            letterSpacing = 1.sp
          )
          Spacer(modifier = Modifier.height(2.dp))
          Text(
            text = when (citizenDialogType) {
              "add_place" -> "Add New Heritage Place"
              "complaint" -> "Register ASI Redressal"
              else -> "Submit Suggestion"
            },
            fontFamily = FontFamily.Serif,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1F2937)
          )
        }
      },
      text = {
        Column {
          Text(
            text = when (citizenDialogType) {
              "add_place" -> "Enter location, history, and description of the unlisted site:"
              "complaint" -> "Describe the monument grievance or ticketing issue:"
              else -> "Suggest guide languages, signage, or barrier-free ramps:"
            },
            fontSize = 12.sp,
            color = Color(0xFF4B5563)
          )
          Spacer(modifier = Modifier.height(8.dp))
          OutlinedTextField(
            value = dialogInputText,
            onValueChange = { dialogInputText = it },
            placeholder = { Text("Enter details here...", fontSize = 13.sp) },
            modifier = Modifier.fillMaxWidth().height(110.dp)
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            citizenDialogType = null
            dialogInputText = ""
            showSubmittedToast = true
          },
          colors = ButtonDefaults.buttonColors(containerColor = HeritageTerracotta),
          shape = RoundedCornerShape(8.dp)
        ) {
          Text("Submit to ASI", fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
      },
      dismissButton = {
        TextButton(onClick = { citizenDialogType = null }) {
          Text("Cancel", color = Color(0xFF6B7280), fontSize = 12.sp)
        }
      }
    )
  }

  // SOS Call Dialog
  if (sosDialDialog != null) {
    val (label, number) = sosDialDialog!!
    AlertDialog(
      onDismissRequest = { sosDialDialog = null },
      title = {
        Text("Emergency Direct Connect", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF962D22))
      },
      text = {
        Text("Connecting you directly to $label dispatch ($number). Toll-free 24x7 emergency response line.", fontSize = 13.sp, color = Color(0xFF374151))
      },
      confirmButton = {
        Button(
          onClick = { sosDialDialog = null },
          colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC0392B)),
          shape = RoundedCornerShape(8.dp)
        ) {
          Text("Call $number", fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
      },
      dismissButton = {
        TextButton(onClick = { sosDialDialog = null }) {
          Text("Cancel", color = Color(0xFF6B7280))
        }
      }
    )
  }

  // Confirmation Snackbar Toast
  if (showSubmittedToast) {
    AlertDialog(
      onDismissRequest = { showSubmittedToast = false },
      title = { Text("Contribution Received", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold) },
      text = { Text("Thank you for supporting Indian heritage preservation. Your submission has been logged with the ASI registry.") },
      confirmButton = {
        Button(
          onClick = { showSubmittedToast = false },
          colors = ButtonDefaults.buttonColors(containerColor = HeritageTerracotta)
        ) {
          Text("Done")
        }
      }
    )
  }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFFCF9F8))
      .verticalScroll(rememberScrollState())
  ) {
    // Top Bar matching mockup
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 10.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onBack) {
        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color(0xFF1F2937))
      }
      Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Indian Heritage", fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Color(0xFFC0392B))
        Text("GOVERNMENT & CULTURAL UTILITIES", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF6B7280), letterSpacing = 1.sp)
      }
      Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = {}) {
          Icon(Icons.Outlined.Notifications, contentDescription = "Notifications", tint = Color(0xFF1F2937))
        }
        IconButton(onClick = {}) {
          Icon(Icons.Outlined.FavoriteBorder, contentDescription = "Favorites", tint = Color(0xFF1F2937))
        }
      }
    }

    // Page Title / Intro Banner (Gradient)
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 6.dp)
        .clip(RoundedCornerShape(20.dp))
        .background(
          Brush.horizontalGradient(
            listOf(Color(0xFF8E281D), Color(0xFFC0392B))
          )
        )
        .padding(18.dp)
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
      ) {
        Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
          Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White.copy(alpha = 0.2f)
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text("⊞", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
              Spacer(modifier = Modifier.width(4.dp))
              Text("PARTNER ECOSYSTEM", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White, letterSpacing = 0.6.sp)
            }
          }
          Spacer(modifier = Modifier.height(8.dp))
          Text("More Apps & Services", fontFamily = FontFamily.Serif, fontSize = 21.sp, fontWeight = FontWeight.Bold, color = Color.White)
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            "Access citizen contribution tools, instant emergency SOS helplines, and verified companion apps to support your heritage visits.",
            fontSize = 12.sp,
            color = Color.White.copy(alpha = 0.85f),
            lineHeight = 17.sp
          )
        }
        Box(
          modifier = Modifier
            .size(50.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(Color.White.copy(alpha = 0.15f))
            .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.25f)), RoundedCornerShape(14.dp)),
          contentAlignment = Alignment.Center
        ) {
          Text("🏛️", fontSize = 24.sp)
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // SECTION 1: Citizen & Traveler Actions
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color.White),
      border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
      elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp)
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        // Section Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.Top
        ) {
          Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
            Text("Citizen & Traveler Actions", fontFamily = FontFamily.Serif, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            Text("Participate in preserving & improving monument experiences", fontSize = 11.sp, color = Color(0xFF6B7280))
          }
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = Color(0xFFFDF2F2)
          ) {
            Text(
              "Contribute",
              fontSize = 11.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFFC0392B),
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Action 1: Add New Place
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier
            .fillMaxWidth()
            .clickable {
              dialogInputText = ""
              citizenDialogType = "add_place"
            }
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFDF2F2)),
              contentAlignment = Alignment.Center
            ) {
              Text("📍", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Add New Place", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFDF2F2)
                ) {
                  Text("Contribute", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Submit unlisted historical ruins, baolis or folk heritage sites", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Icon(Icons.Filled.ChevronRight, contentDescription = "Open", tint = Color(0xFF9CA3AF), modifier = Modifier.size(18.dp))
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Action 2: Register Complaint
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier
            .fillMaxWidth()
            .clickable {
              dialogInputText = ""
              citizenDialogType = "complaint"
            }
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFFFBEB)),
              contentAlignment = Alignment.Center
            ) {
              Text("⚠️", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Register Complaint", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFEF3C7)
                ) {
                  Text("ASI & Civic Redressal", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF92400E), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Report damaged plaques, cleanliness, ticket extortion or ticketing snags", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Icon(Icons.Filled.ChevronRight, contentDescription = "Open", tint = Color(0xFF9CA3AF), modifier = Modifier.size(18.dp))
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Action 3: Submit Suggestion
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier
            .fillMaxWidth()
            .clickable {
              dialogInputText = ""
              citizenDialogType = "suggestion"
            }
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFF0F9FF)),
              contentAlignment = Alignment.Center
            ) {
              Text("💡", fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Submit Suggestion", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFE0F2FE)
                ) {
                  Text("Heritage Improvement", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0369A1), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Propose audio guide languages, signages or barrier-free ramps", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Icon(Icons.Filled.ChevronRight, contentDescription = "Open", tint = Color(0xFF9CA3AF), modifier = Modifier.size(18.dp))
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // SECTION 2: Emergency & SOS Response (Red Card)
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color(0xFF962D22)),
      elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp)
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        // SOS Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(
            modifier = Modifier.weight(1f).padding(end = 8.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text("🚨", fontSize = 22.sp)
            Spacer(modifier = Modifier.width(8.dp))
            Column {
              Text("Emergency & SOS Response", fontFamily = FontFamily.Serif, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
              Text("Instant dispatch & multi-lingual crisis assistance", fontSize = 10.sp, color = Color.White.copy(alpha = 0.85f))
            }
          }
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = Color.White.copy(alpha = 0.2f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.25f))
          ) {
            Text(
              "24X7 EMERGENCY",
              fontSize = 9.sp,
              fontWeight = FontWeight.ExtraBold,
              color = Color.White,
              letterSpacing = 0.6.sp,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Two Prominent SOS Buttons (Police & Ambulance)
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
          // Police SOS Card
          Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.5.dp, Color(0xFFFECACA)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Police & Rescue Dispatch", "112") }
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
              ) {
                Box(
                  modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFFEE2E2)),
                  contentAlignment = Alignment.Center
                ) {
                  Text("🛡️", fontSize = 20.sp)
                }
                Surface(
                  shape = RoundedCornerShape(10.dp),
                  color = Color(0xFFDC2626)
                ) {
                  Text("EMERGENCY", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color.White, modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(10.dp))
              Text("POLICE & RESCUE", fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF6B7280))
              Spacer(modifier = Modifier.height(2.dp))
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text("POLICE", fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color(0xFFC0392B))
                Surface(
                  shape = RoundedCornerShape(8.dp),
                  color = Color(0xFFC0392B)
                ) {
                  Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                    verticalAlignment = Alignment.CenterVertically
                  ) {
                    Text("📞", fontSize = 10.sp)
                    Spacer(modifier = Modifier.width(3.dp))
                    Text("112", fontSize = 11.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                  }
                }
              }
            }
          }

          // Ambulance SOS Card
          Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.5.dp, Color(0xFFFECACA)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Ambulance & EMT", "108") }
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
              ) {
                Box(
                  modifier = Modifier
                    .size(38.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFFFE4E6)),
                  contentAlignment = Alignment.Center
                ) {
                  Text("🏥", fontSize = 20.sp)
                }
                Surface(
                  shape = RoundedCornerShape(10.dp),
                  color = Color(0xFFDC2626)
                ) {
                  Text("MEDICAL", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color.White, modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(10.dp))
              Text("AMBULANCE & EMT", fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF6B7280))
              Spacer(modifier = Modifier.height(2.dp))
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text("AMBULANCE", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color(0xFFC0392B))
                Surface(
                  shape = RoundedCornerShape(8.dp),
                  color = Color(0xFFC0392B)
                ) {
                  Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                    verticalAlignment = Alignment.CenterVertically
                  ) {
                    Text("📞", fontSize = 10.sp)
                    Spacer(modifier = Modifier.width(3.dp))
                    Text("108", fontSize = 11.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                  }
                }
              }
            }
          }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Direct-Dial Helpline Grid (2x2)
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          // Tourist Helpline
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color.White.copy(alpha = 0.12f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.18f)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Tourist Helpline", "1363") }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🎧", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                  Text("Tourist Helpline", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                  Text("Multi-lingual Info", fontSize = 9.sp, color = Color.White.copy(alpha = 0.8f))
                }
              }
              Surface(shape = RoundedCornerShape(6.dp), color = Color.White) {
                Text("1363", fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
              }
            }
          }

          // Women Helpline
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color.White.copy(alpha = 0.12f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.18f)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Women Helpline", "1091") }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🛡️", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                  Text("Women Helpline", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                  Text("Safety & Transit", fontSize = 9.sp, color = Color.White.copy(alpha = 0.8f))
                }
              }
              Surface(shape = RoundedCornerShape(6.dp), color = Color.White) {
                Text("1091", fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
              }
            }
          }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          // Disaster (NDRF)
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color.White.copy(alpha = 0.12f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.18f)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Disaster NDRF", "1078") }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🌊", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                  Text("Disaster (NDRF)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                  Text("Hazard & Flood", fontSize = 9.sp, color = Color.White.copy(alpha = 0.8f))
                }
              }
              Surface(shape = RoundedCornerShape(6.dp), color = Color.White) {
                Text("1078", fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
              }
            }
          }

          // Fire & Rescue
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color.White.copy(alpha = 0.12f),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.18f)),
            modifier = Modifier
              .weight(1f)
              .clickable { sosDialDialog = Pair("Fire & Rescue", "101") }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🚒", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                  Text("Fire & Rescue", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                  Text("Rapid Response", fontSize = 9.sp, color = Color.White.copy(alpha = 0.8f))
                }
              }
              Surface(shape = RoundedCornerShape(6.dp), color = Color.White) {
                Text("101", fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
              }
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // SECTION 3: Featured Heritage Apps
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color.White),
      border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
      elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp)
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        // Section Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.Top
        ) {
          Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
            Text("Featured Heritage Apps", fontFamily = FontFamily.Serif, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
            Text("Official & convenient companion apps during your monument visits", fontSize = 11.sp, color = Color(0xFF6B7280))
          }
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = Color(0xFFFDF2F2)
          ) {
            Text(
              "VERIFIED",
              fontSize = 10.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFFC0392B),
              letterSpacing = 0.6.sp,
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // App 1: Incredible India
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFDF2F2)),
              contentAlignment = Alignment.Center
            ) {
              Text("🧭", fontSize = 22.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Incredible India", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFEE2E2)
                ) {
                  Text("Ministry of Tourism", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFC0392B), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Official travel itineraries, audio walks & verified destination guides", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = Color(0xFFFDF2F2),
              modifier = Modifier.clickable {
                appStatusMap = appStatusMap + ("app1" to "Active")
              }
            ) {
              Text(
                appStatusMap["app1"] ?: "Open ↗",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC0392B),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // App 2: AudioCompass ASI Guide
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFFFBEB)),
              contentAlignment = Alignment.Center
            ) {
              Text("🎧", fontSize = 22.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("AudioCompass ASI Guide", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFEF3C7)
                ) {
                  Text("12 Languages", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF92400E), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Narrated stories, architectural secrets & offline playback at monuments", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = Color(0xFFFDF2F2),
              modifier = Modifier.clickable {
                appStatusMap = appStatusMap + ("app2" to "Playing")
              }
            ) {
              Text(
                appStatusMap["app2"] ?: "Play 🔊",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC0392B),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // App 3: UTS & Heritage Metro
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFF0F9FF)),
              contentAlignment = Alignment.Center
            ) {
              Text("🚇", fontSize = 22.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("UTS & Heritage Metro", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFE0F2FE)
                ) {
                  Text("Transit Ticketing", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0369A1), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Skip ticket counters for monument suburban rail, metro feeder & e-buses", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = Color(0xFFFDF2F2),
              modifier = Modifier.clickable {
                appStatusMap = appStatusMap + ("app3" to "Booked")
              }
            ) {
              Text(
                appStatusMap["app3"] ?: "Book 🚆",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC0392B),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // App 4: 3D Monument AR & Culture
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFECFDF5)),
              contentAlignment = Alignment.Center
            ) {
              Text("🏛️", fontSize = 22.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("3D Monument AR & Culture", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFD1FAE5)
                ) {
                  Text("Interactive AR", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF047857), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("High-resolution 3D reconstructions, inaccessible chambers & relics", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = Color(0xFFFDF2F2),
              modifier = Modifier.clickable {
                appStatusMap = appStatusMap + ("app4" to "Active")
              }
            ) {
              Text(
                appStatusMap["app4"] ?: "Explore 🔄",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC0392B),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // App 5: Tribes India Handicrafts
        Card(
          shape = RoundedCornerShape(14.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          border = BorderStroke(1.dp, Color(0xFFEEE7E4)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFFFDF2F2)),
              contentAlignment = Alignment.Center
            ) {
              Text("🛍️", fontSize = 22.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Tribes India Handicrafts", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1F2937))
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFFE4E6)
                ) {
                  Text("Authentic GI Tag", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFBE123C), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
              }
              Spacer(modifier = Modifier.height(2.dp))
              Text("Fair-trade handcrafted souvenirs, GI-certified artifacts & textiles", fontSize = 11.sp, color = Color(0xFF6B7280), lineHeight = 15.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = Color(0xFFFDF2F2),
              modifier = Modifier.clickable {
                appStatusMap = appStatusMap + ("app5" to "Visited")
              }
            ) {
              Text(
                appStatusMap["app5"] ?: "Visit 🛍",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC0392B),
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
              )
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(36.dp))
  }
}

// -------------------------------------------------------------------------------------------------
// 9. DHAROHAR SIDE DRAWER (Stitch Image 3)
// -------------------------------------------------------------------------------------------------
@Composable
fun ComposeDharoharDrawer(
  onClose: () -> Unit,
  onNavigateToMoreApps: () -> Unit
) {
  var selectedState by remember { mutableStateOf("Madhya Pradesh") }
  var selectedCity by remember { mutableStateOf("Indore") }
  var isStateOpen by remember { mutableStateOf(false) }
  var isCityOpen by remember { mutableStateOf(false) }
  var language by remember { mutableStateOf("EN") }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Black.copy(alpha = 0.5f))
      .clickable { onClose() }
  ) {
    Surface(
      modifier = Modifier
        .fillMaxHeight()
        .width(320.dp)
        .clickable(enabled = false) {},
      color = HeritageBackground,
      shadowElevation = 16.dp
    ) {
      Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        // Accent Bar
        Box(modifier = Modifier.fillMaxWidth().height(4.dp).background(HeritageTerracotta))

        Column(modifier = Modifier.padding(20.dp)) {
          // Brand Header & Close
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Box(
                modifier = Modifier
                  .size(28.dp)
                  .background(HeritageTerracotta, CircleShape),
                contentAlignment = Alignment.Center
              ) {
                Text("🏛️", fontSize = 14.sp)
              }
              Spacer(modifier = Modifier.width(8.dp))
              Text("Dharohar", fontFamily = FontFamily.Serif, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
            }
            IconButton(
              onClick = onClose,
              modifier = Modifier.size(32.dp).background(HeritageSurfaceVariant, CircleShape)
            ) {
              Icon(Icons.Filled.Close, contentDescription = "Close", tint = HeritageOnSurfaceVariant)
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // User Profile Card
          Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(16.dp)) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Box(contentAlignment = Alignment.BottomEnd) {
                  AsyncImage(
                    model = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
                    contentDescription = "Rahul",
                    modifier = Modifier
                      .size(54.dp)
                      .clip(CircleShape)
                      .border(2.dp, HeritageTerracotta, CircleShape),
                    contentScale = ContentScale.Crop
                  )
                  Box(
                    modifier = Modifier
                      .size(16.dp)
                      .background(HeritageTeal, CircleShape),
                    contentAlignment = Alignment.Center
                  ) {
                    Text("✓", fontSize = 9.sp, color = Color.White, fontWeight = FontWeight.Bold)
                  }
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                  Text("🏛 Ministry of Tourism Verified", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageTeal)
                  Text("Namaste, Rahul", fontFamily = FontFamily.Serif, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
                  Surface(shape = RoundedCornerShape(10.dp), color = Color(0xFFFFDCC5)) {
                    Text("★ Master Explorer • Lvl 4", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HeritageRust, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp))
                  }
                }
              }

              Spacer(modifier = Modifier.height(12.dp))
              HorizontalDivider(color = HeritageOutline)
              Spacer(modifier = Modifier.height(10.dp))

              Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceAround) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("18", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
                  Text("MONUMENTS", fontSize = 9.sp, color = HeritageOnSurfaceVariant)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("6", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
                  Text("BADGES", fontSize = 9.sp, color = HeritageOnSurfaceVariant)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("4", fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurface)
                  Text("SAVED", fontSize = 9.sp, color = HeritageOnSurfaceVariant)
                }
              }
            }
          }

          Spacer(modifier = Modifier.height(20.dp))

          // Location Selection
          Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("LOCATION SELECTION", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant, letterSpacing = 1.sp)
            Text("• India", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant)
          }
          Spacer(modifier = Modifier.height(8.dp))

          // Select State Dropdown
          Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth().clickable { isStateOpen = !isStateOpen }
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🗺️ ", fontSize = 18.sp)
                Column {
                  Text("SELECT STATE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant)
                  Text(selectedState, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
              }
              Icon(Icons.Filled.ArrowDropDown, contentDescription = "Dropdown")
            }
          }
          if (isStateOpen) {
            listOf("Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Karnataka").forEach { st ->
              Text(
                st,
                fontSize = 13.sp,
                color = if (st == selectedState) HeritageOnSurface else HeritageOnSurfaceVariant,
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable { selectedState = st; isStateOpen = false }
                  .padding(horizontal = 16.dp, vertical = 6.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(8.dp))

          // Select City Dropdown
          Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth().clickable { isCityOpen = !isCityOpen }
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🏙️ ", fontSize = 18.sp)
                Column {
                  Text("SELECT CITY", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant)
                  Text(selectedCity, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
              }
              Icon(Icons.Filled.ArrowDropDown, contentDescription = "Dropdown")
            }
          }
          if (isCityOpen) {
            listOf("Indore", "Bhopal", "Gwalior", "Ujjain", "Jaipur").forEach { ct ->
              Text(
                ct,
                fontSize = 13.sp,
                color = if (ct == selectedCity) HeritageOnSurface else HeritageOnSurfaceVariant,
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable { selectedCity = ct; isCityOpen = false }
                  .padding(horizontal = 16.dp, vertical = 6.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(8.dp))

          // Auto-detect GPS Banner
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color(0xFFE5F3FB),
            border = BorderStroke(1.dp, Color(0xFFC0E8FF)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                  modifier = Modifier
                    .size(32.dp)
                    .background(HeritageTeal, RoundedCornerShape(8.dp)),
                  contentAlignment = Alignment.Center
                ) {
                  Text("🎯", fontSize = 14.sp)
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                  Text("Auto-Detect Location", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                  Text("Using GPS Coordinates", fontSize = 10.sp, color = HeritageTeal)
                }
              }
              Surface(shape = RoundedCornerShape(10.dp), color = HeritageTeal) {
                Text("• Active", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
              }
            }
          }

          Spacer(modifier = Modifier.height(20.dp))

          // Preferences & Support
          Text("PREFERENCES & SUPPORT", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageOnSurfaceVariant, letterSpacing = 1.sp)
          Spacer(modifier = Modifier.height(8.dp))

          // Language
          Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("文 ", fontSize = 16.sp)
                Column {
                  Text("Select Language", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                  Text("Bhasha / भाषा", fontSize = 10.sp, color = HeritageOnSurfaceVariant)
                }
              }
              Row(
                modifier = Modifier.background(HeritageSurfaceVariant, RoundedCornerShape(8.dp)).padding(2.dp)
              ) {
                Text(
                  "EN",
                  fontSize = 11.sp,
                  fontWeight = FontWeight.Bold,
                  color = if (language == "EN") HeritageOnSurface else HeritageOnSurfaceVariant,
                  modifier = Modifier
                    .background(if (language == "EN") Color.White else Color.Transparent, RoundedCornerShape(6.dp))
                    .clickable { language = "EN" }
                    .padding(horizontal = 8.dp, vertical = 4.dp)
                )
                Text(
                  "हिन्दी",
                  fontSize = 11.sp,
                  fontWeight = FontWeight.Bold,
                  color = if (language == "HI") HeritageOnSurface else HeritageOnSurfaceVariant,
                  modifier = Modifier
                    .background(if (language == "HI") Color.White else Color.Transparent, RoundedCornerShape(6.dp))
                    .clickable { language = "HI" }
                    .padding(horizontal = 8.dp, vertical = 4.dp)
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(8.dp))

          // Government Utilities Link
          Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth().clickable { onNavigateToMoreApps() }
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("📱 ", fontSize = 16.sp)
                Column {
                  Text("Government Utilities", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                  Text("Companion Apps & Services", fontSize = 10.sp, color = HeritageOnSurfaceVariant)
                }
              }
              Icon(Icons.Filled.ChevronRight, contentDescription = "Open")
            }
          }

          Spacer(modifier = Modifier.height(8.dp))

          // Emergency SOS
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = HeritageTerracotta,
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🚨", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                  Text("24X7 HELPLINE", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White.copy(alpha = 0.85f))
                  Text("Emergency SOS", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                  Text("Tourist Police: Dial 1363", fontSize = 10.sp, color = Color.White.copy(alpha = 0.85f))
                }
              }
              Surface(shape = RoundedCornerShape(8.dp), color = Color.White) {
                Text("📞 1363", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = HeritageTerracotta, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
              }
            }
          }

          Spacer(modifier = Modifier.height(18.dp))

          // Editorial Quote
          Card(
            shape = RoundedCornerShape(10.dp),
            colors = CardDefaults.cardColors(containerColor = HeritageSurfaceVariant),
            border = BorderStroke(1.dp, HeritageOutline),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Text(
                "\"Time does not vanish here; it turns into sandstone, song, and stone.\"",
                fontFamily = FontFamily.Serif,
                fontSize = 12.sp,
                fontStyle = FontStyle.Italic,
                color = HeritageOnSurfaceVariant,
                lineHeight = 18.sp
              )
              Text("— ARCHAEOLOGICAL SURVEY OF INDIA", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = HeritageRust, modifier = Modifier.padding(top = 4.dp))
            }
          }

          Spacer(modifier = Modifier.height(18.dp))

          // Footer
          Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text("INCREDIBLE INDIA • ASI PARTNER", fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp, color = HeritageOnSurface)
            Text("Ministry of Culture & Tourism Initiative", fontSize = 9.sp, color = HeritageOnSurfaceVariant)
            Text("Version 2.4.0 (Heritage Build) • Privacy • Terms", fontSize = 8.sp, color = HeritageTextMuted, modifier = Modifier.padding(top = 4.dp))
          }
        }
      }
    }
  }
}
