# Craftly Design System - Web & Mobile Consistency Guide

## 🎨 Color Palette

### Primary Colors (Indigo)
| Name | Hex | Web | Android |
|------|-----|-----|---------|
| Primary 50 | `#eef2ff` | bg-indigo-50 | `Color(0xFFeef2ff)` |
| Primary 100 | `#e0e7ff` | bg-indigo-100 | `Color(0xFFe0e7ff)` |
| Primary 500 | `#6366f1` | bg-indigo-500 | `Color(0xFF6366f1)` |
| Primary 600 | `#4f46e5` | bg-indigo-600 | `Color(0xFF4f46e5)` ⭐ **DEFAULT** |
| Primary 700 | `#4338ca` | bg-indigo-700 | `Color(0xFF4338ca)` |
| Primary 800 | `#3730a3` | bg-indigo-800 | `Color(0xFF3730a3)` |

### Neutral Colors (Gray)
| Name | Hex | Web | Android |
|------|-----|-----|---------|
| Gray 50 | `#f9fafb` | bg-gray-50 | `Color(0xFFf9fafb)` |
| Gray 100 | `#f3f4f6` | bg-gray-100 | `Color(0xFFf3f4f6)` |
| Gray 200 | `#e5e7eb` | bg-gray-200 | `Color(0xFFe5e7eb)` |
| Gray 300 | `#d1d5db` | bg-gray-300 | `Color(0xFFd1d5db)` |
| Gray 400 | `#9ca3af` | text-gray-400 | `Color(0xFF9ca3af)` |
| Gray 500 | `#6b7280` | text-gray-500 | `Color(0xFF6b7280)` |
| Gray 600 | `#4b5563` | text-gray-600 | `Color(0xFF4b5563)` |
| Gray 700 | `#374151` | text-gray-700 | `Color(0xFF374151)` ⭐ **DEFAULT TEXT** |
| Gray 900 | `#111827` | text-gray-900 | `Color(0xFF111827)` |

### Status Colors
| Type | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` | Approved orders, successful actions |
| Error | `#ef4444` | Form errors, failed actions |
| Warning | `#f59e0b` | Pending status |
| Info | `#0ea5e9` | Information alerts |

---

## 📝 Typography

### Font Family
- **Web**: System font stack (default Tailwind)
- **Android**: Roboto (default Material Design)

### Font Sizes & Weights

| Component | Size | Weight | Web Class | Android |
|-----------|------|--------|-----------|---------|
| Heading 1 | 32px | Bold (700) | text-3xl font-bold | fontSize = 32.sp, fontWeight = Bold |
| Heading 2 | 28px | Bold (700) | text-2xl font-bold | fontSize = 28.sp, fontWeight = Bold |
| Heading 3 | 24px | Bold (700) | text-xl font-bold | fontSize = 24.sp, fontWeight = Bold |
| Body Large | 16px | Regular (400) | text-base | fontSize = 16.sp |
| Body Medium | 14px | Regular (400) | text-sm | fontSize = 14.sp |
| Caption | 12px | Regular (400) | text-xs | fontSize = 12.sp |
| Label | 14px | Semibold (600) | text-sm font-semibold | fontSize = 14.sp, fontWeight = SemiBold |

---

## 🔘 Button Design

### Primary Button
```jsx
// WEB
<Button variant="primary" size="md" fullWidth>
  Sign In
</Button>
```

```kotlin
// ANDROID (Jetpack Compose)
Button(
  onClick = { /* action */ },
  modifier = Modifier
    .fillMaxWidth()
    .height(48.dp),
  colors = ButtonDefaults.buttonColors(
    containerColor = Color(0xFF4f46e5),  // indigo-600
    contentColor = Color.White
  ),
  shape = RoundedCornerShape(8.dp)
) {
  Text("Sign In", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
}
```

### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | Indigo-600 | White | - | Primary actions |
| Secondary | Gray-200 | Gray-900 | - | Secondary actions |
| Outline | Transparent | Indigo-600 | Indigo-600 | Alternative actions |
| Ghost | Transparent | Indigo-600 | - | Tertiary actions |
| Danger | Red-600 | White | - | Delete/Remove |

### Button Sizes

| Size | Padding | Font Size | Min Height |
|------|---------|-----------|------------|
| Small (sm) | 12px 12px | 14px | 36px |
| Medium (md) | 16px 16px | 16px | 48px |
| Large (lg) | 24px 24px | 16px | 56px |

---

## 📋 Input Fields

### Text Input
```jsx
// WEB
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helperText={errors.email}
  fullWidth
/>
```

```kotlin
// ANDROID
TextField(
  value = email,
  onValueChange = { email = it },
  label = { Text("Email") },
  placeholder = { Text("you@example.com") },
  modifier = Modifier
    .fillMaxWidth()
    .height(56.dp),
  shape = RoundedCornerShape(8.dp),
  colors = TextFieldDefaults.colors(
    focusedContainerColor = Color(0xFFF3f4f6),  // gray-100
    unfocusedContainerColor = Color(0xFFF9fafb),  // gray-50
    focusedIndicatorColor = Color(0xFF4f46e5),  // indigo-600
    unfocusedIndicatorColor = Color(0xFFd1d5db)  // gray-300
  ),
  isError = errors.contains("email"),
  supportingText = { if (errors.contains("email")) Text(errors["email"] ?: "") }
)
```

### Input Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Border Radius | 8px | RoundedCornerShape(8.dp) |
| Border Color (Normal) | Gray-300 | Color(0xFFd1d5db) |
| Border Color (Focus) | Indigo-500 | Color(0xFF6366f1) |
| Background (Normal) | Gray-50 | Color(0xFFf9fafb) |
| Background (Focus) | Gray-100 | Color(0xFFf3f4f6) |
| Text Color | Gray-900 | Color(0xFF111827) |
| Placeholder Color | Gray-400 | Color(0xFF9ca3af) |
| Label Size | 14px | Small font, Gray-700 |
| Error Color | Red-500 | Color(0xFFef4444) |

---

## 🏠 Layout & Spacing

### Spacing Scale (in dp/px)
```
4px  = 4.dp
8px  = 8.dp
12px = 12.dp
16px = 16.dp (standard)
20px = 20.dp
24px = 24.dp
32px = 32.dp
```

### Screen Padding
- **Web**: 20px-32px horizontal (responsive)
- **Android**: 16dp horizontal, 24dp vertical

### Component Spacing
- Input fields: 16dp gap between label and input
- Buttons: 12dp gap between button and helper text
- Form sections: 24dp gap between form groups

---

## 🔐 Authentication Screens Design

### Sign In / Login Screen
```
Header:
  - Title: "Welcome Back" or "Sign In"
  - Subtitle: "Enter your credentials"

Form:
  - Email input (required)
  - Password input (required, masked)
  - "Remember Me" checkbox (optional)
  - Sign In button (full width, primary)
  - Error message area

Footer:
  - "Don't have an account? Sign Up" (link)
```

### Sign Up / Register Screen
```
Header:
  - Title: "Create Account" or "Get Started"
  - Subtitle: "Join our marketplace"

Form:
  - Full Name input (required)
  - Email input (required)
  - Password input (required, masked)
  - Confirm Password input (required, masked)
  - Terms checkbox (required)
  - Sign Up button (full width, primary)
  - Error message area

Footer:
  - "Already have an account? Sign In" (link)
```

---

## 🎯 Loading & Error States

### Loading Spinner
- **Web**: Spinning circle animation, 16px
- **Android**: CircularProgressIndicator(modifier = Modifier.size(24.dp))

### Error Display
- Text Color: Red-600 (#dc2626)
- Font Size: 12px / 12.sp
- Placement: Below input or as top alert

### Error Alert (Full Screen)
```jsx
// WEB
<Alert variant="error" title="Sign In Failed" message="Invalid email or password" />
```

```kotlin
// ANDROID
if (errorMessage.isNotEmpty()) {
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .padding(16.dp),
    color = Color(0xFFfef2f2),  // error-50
    shape = RoundedCornerShape(8.dp)
  ) {
    Column(modifier = Modifier.padding(16.dp)) {
      Text(
        "Error",
        color = Color(0xFFdc2626),  // error-600
        fontWeight = FontWeight.SemiBold
      )
      Text(errorMessage, color = Color(0xFFdc2626))
    }
  }
}
```

---

## 📱 Responsive Breakpoints

### Web (Tailwind)
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Android
- Phone Portrait: 360dp - 480dp width
- Phone Landscape: 640dp - 720dp width
- Tablet: > 720dp width

---

## ✨ Visual Consistency Checklist

- [ ] **Colors**: All primary actions use Indigo-600
- [ ] **Spacing**: 16dp is the standard unit
- [ ] **Border Radius**: All inputs/buttons have 8dp radius
- [ ] **Typography**: Consistent font sizes and weights
- [ ] **Loading**: Same spinner style on both platforms
- [ ] **Errors**: Red-600 text with error-50 background
- [ ] **Buttons**: Minimum 48dp height on mobile
- [ ] **Inputs**: 56dp height (48dp content + 8dp padding)

---

## 🔗 Implementation Files

### Web
- `client/src/components/Button.jsx` - Button component
- `client/src/components/Input.jsx` - Input component
- `client/tailwind.config.js` - Tailwind config
- `client/src/index.css` - Global styles

### Android
- `android/app/src/main/java/com/example/craftly/ui/theme/Color.kt` - Color definitions
- `android/app/src/main/java/com/example/craftly/ui/theme/Type.kt` - Typography
- `android/app/src/main/java/com/example/craftly/ui/screens/auth/LoginScreen.kt` - Login UI
- `android/app/src/main/java/com/example/craftly/ui/screens/auth/RegisterScreen.kt` - Register UI
