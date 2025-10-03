// routes/dashboard.js
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.youtubeAccessToken) {
      return res.status(400).json({ error: "YouTube not connected" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: user.youtubeAccessToken,
      refresh_token: user.youtubeRefreshToken,
    });
    
    const youtubeDataApi = google.youtube({ version: "v3", auth: oauth2Client });
    const youtubeAnalyticsApi = google.youtubeAnalytics({ version: "v2", auth: oauth2Client });
    
    const channelResponse = await youtubeDataApi.channels.list({
      part: "snippet,contentDetails,statistics",
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: "YouTube channel not found." });
    }

    const stats = channelResponse.data.items[0].statistics;
    const snippet = channelResponse.data.items[0].snippet;
    const channelId = channelResponse.data.items[0].id;
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    let totalLikes = 0;
    let totalComments = 0;

    const videosResponse = await youtubeDataApi.playlistItems.list({
      playlistId: uploadsPlaylistId,
      part: 'contentDetails',
      maxResults: 50
    });

    if (videosResponse.data.items.length > 0) {
      const videoIds = videosResponse.data.items.map(item => item.contentDetails.videoId);
      const videoStatsResponse = await youtubeDataApi.videos.list({
        part: 'statistics',
        id: videoIds.join(','),
      });
      videoStatsResponse.data.items.forEach(video => {
        totalLikes += parseInt(video.statistics.likeCount, 10);
        totalComments += parseInt(video.statistics.commentCount, 10);
      });
    }
    
    const analyticsResponse = await youtubeAnalyticsApi.reports.query({
      ids: `channel==${channelId}`,
      startDate: "2005-01-01",
      endDate: new Date().toISOString().split("T")[0],
      metrics: "shares",
    });
    
    const totalShares = analyticsResponse.data.rows && analyticsResponse.data.rows.length > 0 ? analyticsResponse.data.rows[0][0] : 0;

    res.json({
      channelName: snippet.title,
      channelLogo: snippet.thumbnails.default.url,
      subscribers: stats.subscriberCount,
      views: stats.viewCount,
      totalVideos: stats.videoCount,
      totalLikes: totalLikes,
      totalComments: totalComments,
      totalShares: totalShares,
    });

  } catch (err) {
    console.error("DETAILED ERROR:", err.response ? err.response.data.error : err.message);
    res.status(500).json({ error: "Failed to fetch YouTube data" });
  }
});

module.exports = router;