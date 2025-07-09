# Jekyll Component Navigation: Challenge-Based Tutorial

## Learning Goals

Build a reusable, component-based navigation system for your Jekyll portfolio site. Each challenge tackles a specific navigation problem using modern development patterns that prepare you for React.

**Core Philosophy**: Start with concrete problems, attempt solutions with guidance, then see working implementations that build toward a complete navigation system.

---

## Challenge 1: The Repetitive Styling Problem (5 minutes)

### The Problem

You're building navigation links and realize you'll be copying the same long Tailwind classes (`px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:text-yellow-400`) to every single link. This creates maintenance nightmares and inconsistent styling.

### Learning Target

**Component templating** - Creating reusable HTML templates that accept parameters to eliminate code duplication

### Your Challenge

Create a Jekyll include file that acts as a "nav-item component" - a reusable template that takes a URL and text as parameters and outputs a consistently styled navigation link.

### Concepts You'll Need

- **Jekyll includes**: Reusable HTML snippets stored in `_includes/` folder
- **Liquid templating**: `{{ include.parameter }}` syntax for passing data to includes
- **Component thinking**: Building small, focused, reusable pieces

### Hints

1. Create a file called `nav-item.html` in your `_includes` folder
2. Use `{{ include.url }}` and `{{ include.text }}` to accept parameters
3. Apply your navigation styling to this one template
4. Test by including it with different URL and text values

### Try It First

Take 3 minutes to create your first Jekyll component before looking at the solution.

### Test Your Solution

```html
<!-- In any HTML file, test your component: -->
{% include nav-item.html url="/" text="HOME" %}
<!-- Should output: <a href="/" class="nav-link">HOME</a> -->

{% include nav-item.html url="/about/" text="ABOUT" %}
<!-- Should output: <a href="/about/" class="nav-link">ABOUT</a> -->

<!-- Check that both links have identical styling -->
<!-- Verify the links actually work when clicked -->
```

### Solution

```html
<!-- _includes/nav-item.html -->
<a href="{{ include.url }}" class="nav-link">
  {{ include.text }}
</a>
```

### Challenge Questions

1. What does `{{ include.url }}` actually do when Jekyll processes the file?
2. How is this different from just copying the same `<a>` tag multiple times?
3. What happens if you change the styling in this one file?

---

## Challenge 2: The Active State Problem (7 minutes)

### The Problem

Your navigation links all look the same, so users can't tell which page they're currently on. You need active states, but adding conditional logic to each link manually would defeat the purpose of componentization.

### Learning Target

**Conditional rendering in templates** - Adding logic to components that changes output based on passed parameters

### Your Challenge

Modify your nav-item component to accept an `active` parameter and apply different styling when that parameter is true. Use Jekyll's Liquid templating to conditionally add an "active" CSS class.

### Concepts You'll Need

- **Liquid conditionals**: `{% if %}` statements in templates
- **CSS class composition**: Adding multiple classes based on conditions
- **Boolean parameters**: Passing true/false values to includes
- **Ternary operations**: Compact if/else logic in Liquid

### Hints

1. Add an `{% if include.active %}` condition to your existing nav-item template
2. You can add multiple CSS classes: `class="nav-link {% if include.active %}active{% endif %}"`
3. Test by passing `active=true` to one nav item and `active=false` (or nothing) to others
4. Define the `.active` styles in your CSS to see the difference

### Try It First

Take 4 minutes to add conditional styling to your component.

### Test Your Solution

```html
<!-- Test active and inactive states -->
{% include nav-item.html url="/" text="HOME" active=true %}
<!-- Should output: <a href="/" class="nav-link active">HOME</a> -->

{% include nav-item.html url="/about/" text="ABOUT" active=false %}
<!-- Should output: <a href="/about/" class="nav-link">ABOUT</a> -->

{% include nav-item.html url="/contact/" text="CONTACT" %}
<!-- Should output: <a href="/contact/" class="nav-link">CONTACT</a> (no active class) -->

<!-- Visually verify that the active link looks different from inactive ones -->
```

### Solution

```html
<!-- _includes/nav-item.html -->
<a href="{{ include.url }}" 
   class="nav-link {% if include.active %}active{% endif %}">
  {{ include.text }}
</a>
```

### Challenge Questions

1. What exactly does `{% if include.active %}active{% endif %}` do when `active=true` vs `active=false`?
2. Why is this approach better than having separate "nav-item" and "nav-item-active" components?
3. What would happen if you forgot to pass the `active` parameter to an include?

---

## Challenge 3: The Page-Aware Navigation Problem (10 minutes)

### The Problem

You have conditional styling working, but you're manually setting `active=true` for testing. In a real site, the navigation needs to automatically detect which page is current and highlight the corresponding link without manual intervention.

### Learning Target

**Dynamic state management** - Making components automatically respond to page context using Jekyll's built-in variables

### Your Challenge

Set up a system where each page declares its "nav section" in front matter, and the navigation automatically highlights the correct link by comparing page data to each nav item's identifier.

### Concepts You'll Need

- **Front matter variables**: Custom data defined at the top of pages
- **Jekyll page variables**: `page.variable_name` access in templates
- **Comparison operations**: Using `==` in Liquid templates
- **Template logic**: Making components smart about their context

### Hints

1. Add a variable like `nav_active: "home"` to your page front matter
2. Give each nav item a unique identifier to compare against
3. Use `active=page.nav_active == "identifier"` in your include calls
4. Test by creating pages with different `nav_active` values

### Try It First

Take 5 minutes to make your navigation automatically detect the current page.

### Test Your Solution

```yaml
# In index.md front matter:
---
layout: default
nav_active: home
---
```

```yaml
# In about.md front matter:
---
layout: default
nav_active: about
---
```

```html
<!-- In your layout or wherever navigation appears: -->
{% include nav-item.html url="/" text="HOME" active=page.nav_active == "home" %}
{% include nav-item.html url="/about/" text="ABOUT" active=page.nav_active == "about" %}
{% include nav-item.html url="/contact/" text="CONTACT" active=page.nav_active == "contact" %}

<!-- Test by navigating between pages - only the current page's nav item should be highlighted -->
<!-- Verify that index.md shows HOME as active, about.md shows ABOUT as active, etc. -->
```

### Solution

```html
<!-- _includes/nav-item.html (unchanged) -->
<a href="{{ include.url }}" 
   class="nav-link {% if include.active %}active{% endif %}">
  {{ include.text }}
</a>
```

```yaml
# In each page's front matter:
---
layout: default
nav_active: home  # or "about", "contact", etc.
---
```

```html
<!-- Usage in layout: -->
{% include nav-item.html url="/" text="HOME" active=page.nav_active == "home" %}
{% include nav-item.html url="/about/" text="ABOUT" active=page.nav_active == "about" %}
```

### Challenge Questions

1. What exactly does `page.nav_active == "home"` evaluate to, and when?
2. How does this system know which page you're currently viewing?
3. What would happen if you forgot to add `nav_active` to a page's front matter?
4. How could you set a default active state for pages without `nav_active`?

---

## Challenge 4: The Complete Navigation Assembly Problem (8 minutes)

### The Problem

You have working nav-item components, but they're scattered wherever you test them. You need to assemble them into a complete navigation component that contains all your portfolio links and can be easily included in layouts.

### Learning Target

**Component composition** - Building larger components from smaller ones while maintaining organization and reusability

### Your Challenge

Create a complete navigation component that uses your nav-item components to build the full navigation for your portfolio site. Include all the sections from your Figma design: HOME, ABOUT, CONTACT, RESUME, UX/UI DEVELOPMENT, PHOTOGRAPHY, and VISUAL DESIGN.

### Concepts You'll Need

- **Component composition**: Using one include inside another
- **Navigation containers**: HTML structure for organizing multiple links
- **Layout integration**: Including complete components in Jekyll layouts
- **Semantic HTML**: Using proper `<nav>` elements for accessibility

### Hints

1. Create a new include file called `navigation.html` 
2. Use a `<nav>` element to contain all your nav-item includes
3. Apply container styling (like Flexbox) to the nav wrapper
4. Include this complete navigation in your layout file

### Try It First

Take 5 minutes to assemble your individual nav items into a complete navigation system.

### Test Your Solution

```html
<!-- Include the complete navigation in _layouts/default.html: -->
<header>
  {% include navigation.html %}
</header>

<!-- Should render a complete navigation bar with all links -->
<!-- Active states should work automatically based on page front matter -->
<!-- Navigation should be consistently styled across all pages -->

<!-- Test by: -->
<!-- 1. Creating pages with different nav_active values -->
<!-- 2. Verifying the correct link highlights on each page -->
<!-- 3. Checking that all links actually navigate correctly -->
```

### Solution

```html
<!-- _includes/navigation.html -->
<nav class="flex space-x-6">
  {% include nav-item.html url="/" text="HOME" active=page.nav_active == "home" %}
  {% include nav-item.html url="/about/" text="ABOUT" active=page.nav_active == "about" %}
  {% include nav-item.html url="/contact/" text="CONTACT" active=page.nav_active == "contact" %}
  {% include nav-item.html url="/resume/" text="RESUME" active=page.nav_active == "resume" %}
  {% include nav-item.html url="/ux-ui/" text="UX/UI DEVELOPMENT" active=page.nav_active == "ux-ui" %}
  {% include nav-item.html url="/photography/" text="PHOTOGRAPHY" active=page.nav_active == "photography" %}
  {% include nav-item.html url="/visual-design/" text="VISUAL DESIGN" active=page.nav_active == "visual-design" %}
</nav>
```

```html
<!-- _layouts/default.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- your head content -->
</head>
<body>
  <header>
    {% include navigation.html %}
  </header>
  
  <main>
    {{ content }}
  </main>
</body>
</html>
```

### Challenge Questions

1. Why create a separate `navigation.html` instead of putting all nav-items directly in the layout?
2. How does the `<nav>` element help with accessibility and SEO?
3. What happens when you need to add a new section to your site?
4. How would you modify this system to work with a mobile hamburger menu?

---

## Challenge 5: The Styling Integration Problem (7 minutes)

### The Problem

You have a working component system, but you're still using generic `nav-link` classes. You need to integrate your actual design from Figma - the specific typography, colors, hover states, and spacing that match your portfolio aesthetic.

### Learning Target

**CSS architecture with components** - Organizing styles to work efficiently with component-based HTML while avoiding Tailwind class repetition

### Your Challenge

Create the actual styling for your navigation using Tailwind's `@apply` directive to group utilities into semantic class names that match your Figma design.

### Concepts You'll Need

- **@apply directive**: Tailwind's way to group utility classes into reusable CSS classes
- **CSS specificity**: How `.nav-link.active` targets active states specifically
- **Transition effects**: Creating smooth hover and active state changes
- **Design system consistency**: Translating Figma designs into maintainable CSS

### Hints

1. Look at your Figma design for exact colors, fonts, and spacing
2. Use `@apply` to group Tailwind utilities: `@apply px-4 py-2 text-white;`
3. Create separate rules for base state (`.nav-link`) and active state (`.nav-link.active`)
4. Add hover effects and transitions for professional polish

### Try It First

Take 4 minutes to style your navigation to match your portfolio design.

### Test Your Solution

```css
/* Add this to your main CSS file and test: */
.nav-link {
  /* Your @apply styles here */
}

.nav-link.active {
  /* Your active state styles here */
}

/* Test by: */
/* 1. Viewing navigation in browser - should match Figma design */
/* 2. Hovering over links - should have smooth transitions */
/* 3. Navigating between pages - active states should be clearly visible */
/* 4. Checking that typography and spacing match your design system */
```

### Solution

```css
/* In your main CSS file */
.nav-link {
  @apply px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:text-yellow-400 relative;
}

.nav-link.active {
  @apply text-yellow-400;
}

/* Optional: Add underline effect for active state */
.nav-link.active::before {
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400;
  content: '';
}
```

### Challenge Questions

1. Why use `@apply` instead of writing all the Tailwind classes directly in the HTML?
2. How does this CSS architecture scale when you add more component types?
3. What's the benefit of using CSS custom properties vs hard-coded colors?
4. How would you modify this system to support a dark/light theme toggle?

---

## Summary

You've built a complete component-based navigation system! You learned:

- **Component templating** - Creating reusable HTML templates with parameters
- **Conditional rendering** - Making components respond to different states
- **Dynamic state management** - Automatically detecting current page context
- **Component composition** - Building complex systems from simple pieces
- **CSS architecture** - Organizing styles to work with component-based HTML

### The React Connection

This Jekyll component system mirrors React patterns:
- **Jekyll includes** = **React components**
- **`{{ include.prop }}`** = **`{props.prop}`**
- **Liquid conditionals** = **JSX conditional rendering**
- **Component composition** = **Component composition**

### Next Steps

This pattern works for any UI element:
- **Hero sections** with different backgrounds and content
- **Card components** for portfolio pieces
- **Form inputs** with validation states
- **Modal dialogs** with different content types

The same methodology applies to any component-based framework - identify reusable patterns, break them into focused components, and compose them into larger systems.