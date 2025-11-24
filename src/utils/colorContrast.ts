/**
 * Convert a hex color to relative luminance
 * Based on the WCAG 2.1 formula
 */
function getLuminance(hexColor: string): number {
    // Remove '#' from the color if present
    const hex = hexColor.replace('#', '');
    // Convert hex to RGB (0–255) and normalize to 0–1
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

    // Apply gamma correction to each channel
    const [rs, gs, bs] = [r, g, b].map(c => {
        // WCAG rule: linearize the sRGB component
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Calculate the relative luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate the contrast ratio between two colors
 * @returns a number between 1 and 21
 */
function getContrastRatio(color1: string, color2: string): number {
    // Compute luminance for both colors
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    // Find the brighter and darker luminance
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    // Return the contrast ratio formula
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hexColor: string, amount: number = 0.3): string {
    // Remove '#' symbol
    const hex = hexColor.replace('#', '');

    // Multiply RGB values by (1 - amount) to darken
    const r = Math.max(0, Number.parseInt(hex.substring(0, 2), 16) * (1 - amount));
    const g = Math.max(0, Number.parseInt(hex.substring(2, 4), 16) * (1 - amount));
    const b = Math.max(0, Number.parseInt(hex.substring(4, 6), 16) * (1 - amount));

    // Convert back to hex, pad with zeros if needed
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
        .toString(16)
        .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Generate accessible color CSS variables
 */
export function generateAccessibleColorVariables(
    primaryColor: string,
    backgroundColor: string = '#FFFFFF',
    targetContrastRatio: number = 4.5 // WCAG AA standard for normal text
): {
    accessibleColor: string;
    contrastRatio: number;
} {
    // Compute the contrast ratio between primary and background
    const contrastRatio = getContrastRatio(primaryColor, backgroundColor);

    // If contrast is already sufficient, use the primary color
    if (contrastRatio >= targetContrastRatio) {
        return {
            accessibleColor: primaryColor,
            contrastRatio,
        };
    }

    // Progressively darken the color until it meets the contrast target
    let darkenedColor = primaryColor;
    let attempts = 0;
    const maxAttempts = 10; // Limit iterations to prevent infinite loops

    // Loop: darken the color until contrast is sufficient or max attempts reached
    while (
        getContrastRatio(darkenedColor, backgroundColor) < targetContrastRatio &&
        attempts < maxAttempts
        ) {
        // Darken by 15% on each iteration
        darkenedColor = darkenColor(darkenedColor, 0.15);
        attempts++;
    }

    // Calculate the final contrast ratio after darkening
    const finalContrastRatio = getContrastRatio(darkenedColor, backgroundColor);

    // If still insufficient, fall back to a safe dark grey (#4E4E5F)
    // Otherwise, use the darkened color
    const fallbackColor =
        finalContrastRatio < targetContrastRatio ? '#4E4E5F' : darkenedColor;

    // Return the accessible color variable
    return {
        accessibleColor: fallbackColor,
        contrastRatio: getContrastRatio(fallbackColor, backgroundColor),
    };
}
