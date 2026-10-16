# Google AdSense Monitoring Guide

**Client ID:** `ca-pub-6102960658829353`  
**Account Email:** `ouseph13@gmail.com`  
**Dashboard:** https://adsense.google.com

---

## Quick Links

- **AdSense Dashboard:** https://adsense.google.com
- **Performance Report:** https://adsense.google.com/u/0/reports/overview
- **Ad Units:** https://adsense.google.com/u/0/myads/adunits

---

## Ad Placements & Slot Configuration

### Current Ad Units

| Location | Slot ID | Format | Position | Device |
|----------|---------|--------|----------|--------|
| Top Banner (Layout) | `7264929408` | Leaderboard 728x90 | Header | Desktop/Mobile |
| Bottom Banner (Layout) | `7264929408` | Leaderboard 728x90 | Footer | Desktop/Mobile |
| Home Page | `2841969201` | Rectangle 300x250 | Below categories | All |
| BMI Calculator | `2841969201` | Rectangle/Vertical | Right sidebar | Responsive |
| Compound Interest | `2841969201` | Rectangle/Vertical | Right sidebar | Responsive |
| Dashboard | `2841969201` | Rectangle 300x250 | Below content | All |
| Category Hub | `2841969201` | Rectangle 300x250 | Below tools | All |

---

## Key Metrics to Monitor

### Daily Checks (Morning Routine)
1. **Impressions:** Number of ads shown (target: track trend)
2. **Clicks:** Number of ad clicks (target: 0.5-2% of impressions)
3. **CTR (Click-Through Rate):** clicks ÷ impressions × 100 (target: >0.5%)
4. **RPM (Revenue Per Mille):** (earnings ÷ impressions) × 1000 (target: >$0.50)
5. **Daily Revenue:** Total earnings for the day

### Weekly Analysis
- **Page RPM:** Which pages have highest earning potential
- **User Demographics:** Which regions generate most revenue
- **Device Performance:** Mobile vs. Desktop CTR & RPM
- **Ad Format Performance:** Which ad sizes perform best

### Monthly Review (End of Month)
1. **Total Impressions:** Overall reach
2. **Total Clicks:** Engagement level
3. **Total Earnings:** Monthly revenue
4. **Average CTR:** Quality of traffic
5. **Average RPM:** Monetization efficiency
6. **Growth Trends:** Compare to previous month

---

## Performance Optimization Tips

### Increase CTR (Click-Through Rate)
- ✅ Place ads in high-traffic areas (sidebars, below content)
- ✅ Match ad colors to your site theme (already done with dark mode support)
- ✅ Avoid over-crowding with too many ads
- ✅ Ensure ads are visible (above the fold when possible)

### Increase RPM (Revenue Per Mille)
- ✅ Focus on English-speaking audience (higher RPM)
- ✅ Target high-income countries (US, UK, CA, AU)
- ✅ Create quality content (already done - calculator category)
- ✅ Use responsive ads (already enabled)

### Monitor for Ad Interference
- ⚠️ Don't place ads on form inputs
- ⚠️ Ensure ads aren't covering calculator controls
- ⚠️ Keep ads away from "favorite" buttons
- ⚠️ Verify mobile layout doesn't break

---

## Ad Implementation Code

### AdSenseUnit Component
Location: `src/components/ads/AdSenseUnit.jsx`

```jsx
<AdSenseUnit slot="rectangle" />
```

### AdGrid Component (Responsive)
Location: `src/components/ads/AdGrid.jsx`

```jsx
<AdGrid position="sidebar" />       // Sticky sidebar
<AdGrid position="below-content" /> // Full-width below
<AdGrid position="inline" />        // Inline with content
```

---

## Revenue Goals & Tracking

### Monthly Revenue Targets
- **Target:** $50-100/month (conservative, with 41 calculator pages)
- **Calculation:** 10K impressions/day × $2 RPM = ~$600/month

### How to Hit These Numbers

1. **Drive Traffic (Year 1)**
   - SEO optimization (already done: sitemap, schema, llms.txt)
   - Backlink building
   - Social media promotion
   - Reddit/calculator communities

2. **Optimize Ad Placement**
   - Currently 5 visible ad placements (top, bottom, home, calc sidebar, dashboard)
   - Add ads to remaining 38 calculator pages (easy copy-paste)
   - Consider in-article ads for explanations

3. **Monitor & Iterate**
   - Check daily earnings
   - Identify high-performing pages
   - Double down on those categories
   - A/B test ad positions

---

## Troubleshooting

### No Ads Showing?
1. Check if script loaded: DevTools → Network → search `googlesyndication.com`
2. Verify client ID: Should be `ca-pub-6102960658829353`
3. Clear browser cache and reload
4. Check AdSense account for policy violations
5. Wait 24 hours (new sites take time to activate)

### Low CTR?
- Check ad positioning (should be visible without scrolling)
- Verify ad format matches content area
- Ensure ads aren't blocked by CSS (z-index issues)
- Test on mobile devices (40%+ traffic)

### Low RPM?
- Check visitor geography (target US/UK/CA traffic)
- Verify ad quality (high-quality traffic = higher RPM)
- Consider traffic source (organic > direct > referral)
- Review contextual relevance (calculators = good vertical)

---

## Next Steps

### Phase 2: Expand Ad Coverage (2-4 hours)
- [ ] Add ads to remaining 38 calculator pages (copy-paste AdGrid)
- [ ] Create ad placement variations (sidebar vs. inline)
- [ ] Test mobile layout for ad interference
- [ ] Monitor CTR/RPM per page type

### Phase 3: Advanced Optimization (1-2 weeks)
- [ ] Implement custom ad matching (for finance/health/cooking categories)
- [ ] Add category-specific ads (finance → financial product ads)
- [ ] A/B test ad formats (rectangle vs. vertical)
- [ ] Add remarketing campaigns

### Phase 4: Scale & Monetize (Ongoing)
- [ ] Drive organic traffic via SEO
- [ ] Build calculator tool database (more pages = more ad slots)
- [ ] Cross-promote related calculators
- [ ] Create niche calculator tools (expand product)

---

## Quick Reference: Ad Slot IDs

```
Rectangle (300x250):    2841969201
Vertical (160x600):     3947352957
Square (250x250):       4586127832
Leaderboard (728x90):   7264929408
```

---

## Support & Resources

- **AdSense Help:** https://support.google.com/adsense
- **Policy Violations:** https://support.google.com/adsense/answer/48182
- **Site Health Report:** https://adsense.google.com/u/0/site/[yoursite]/overview
- **Revenue Sharing:** 68% Google, 32% Publisher (standard)

---

**Last Updated:** 2026-10-16  
**Status:** ✅ Monitoring Setup Complete
