# Google Analytics 4 Setup Guide for TitanTech Solutions

## Step-by-Step Google Analytics Setup

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring"
3. Create an account name: "TitanTech Solutions"

### 2. Set up Property
1. **Property name**: "TitanTech Solutions Website"
2. **Reporting time zone**: Your business timezone
3. **Currency**: USD (or your preferred currency)

### 3. Set up Data Stream
1. **Platform**: Web
2. **Website URL**: `https://titantechsol.github.com` (or your custom domain)
3. **Stream name**: "TitanTech Solutions Main Site"
4. **Enhanced measurement**: ✅ Keep enabled

### 4. Get Your Measurement ID
After setup, you'll see a **Measurement ID** like `G-ABC123XYZ`. 

## Implementation Options

### Option 1: Environment Variable (Recommended)
Create a `.env` file in your project root:
```
REACT_APP_GA4_MEASUREMENT_ID=G-YOUR-ACTUAL-ID
```

### Option 2: Direct Code Update
Replace the placeholder in `src/analytics/AnalyticsManager.js`:
```javascript
this.trackingId = 'G-YOUR-ACTUAL-ID'; // Replace G-XXXXXXXXXX
```

## Google Tag Manager Instructions (If you chose GTM)

If Google Analytics prompted you to use Google Tag Manager instead:

### 1. Get GTM Container ID
You'll get a container ID like `GTM-XXXXXXX`

### 2. Update Our Code
I can modify our analytics to work with GTM instead of direct GA4 if needed.

### 3. GTM Setup
1. Create a GA4 Configuration tag in GTM
2. Add your GA4 Measurement ID to the GTM tag
3. Set up triggers for page views and events

## Testing Your Setup

### 1. Development Testing
```bash
npm run dev
```
- Open browser console
- Look for "Analytics Manager initialized with tracking ID: G-YOUR-ID"
- Accept cookie consent
- Navigate between pages to test tracking

### 2. Production Testing
1. Deploy to GitHub Pages
2. Use GA4 Real-time reports to verify data
3. Check Events tab for custom events (CTA clicks, etc.)

## Key Events to Verify

### Automatic Events
- Page views (when navigating between pages)
- Scroll depth (scroll down 25%, 50%, 75%, etc.)
- Time milestones (30 seconds, 1 minute, 2 minutes)

### Custom Business Events
- CTA clicks (click any "Get in Touch" or "Contact Us Today" button)
- Form interactions (when contact form is implemented)
- Service page views
- Team profile views

## Expected Data in GA4

### Real-time Report
You should see:
- Active users on the site
- Page views as you navigate
- Events firing (cta_click, user_journey, etc.)

### Events Report
Look for these custom events:
- `cta_click` - Button clicks
- `user_journey` - Navigation tracking
- `engagement` - Scroll depth, time milestones
- `service_interest` - Service page interactions

## Troubleshooting

### No Data Appearing
1. Check measurement ID is correct
2. Verify cookie consent was accepted
3. Check browser console for errors
4. Ensure site is deployed (not just local development)

### Events Not Firing
1. Open browser developer tools
2. Go to Network tab
3. Filter by "google-analytics.com" or "analytics.google.com"
4. Should see requests when events fire

## Next Steps After Setup

1. **Verify Data Collection**: Wait 24-48 hours for full data
2. **Set up Goals**: Convert our tracked events to GA4 conversions
3. **Create Audiences**: Segment users by behavior
4. **Build Reports**: Custom dashboards for business metrics

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify the measurement ID format (should be G-XXXXXXXXXX)
3. Test in an incognito window to avoid cookie issues
4. Let me know what step you're stuck on!

---

**Ready to implement once you have your Measurement ID!** 🚀
