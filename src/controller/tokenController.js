



const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const Token_model = require('../models/tokenModel');

exports.checklimitplus_tokens = async (username) => { //check if tokens are more than 5
    try {
        const tokenEntry = await Token_model.findOne({ username });
        if (tokenEntry && tokenEntry.token.length >= 5) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking token limit:', error);
        return false;
    }
};
   

exports.delete_expired_tokens_in_this_username = async (username) => {
    try {
        const tokenDoc = await Token_model.findOne({ username });
        if (!tokenDoc) {
            console.log(`No token document found for username: ${username}`);
            return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Current Time (s):', currentTime);
        const jwt = require('jsonwebtoken');

        const originalAccessTokenCount = tokenDoc.token.length;
        const originalRefreshTokenCount = tokenDoc.refreshToken.length;

        const activeTokens = tokenDoc.token.filter(token => {
            try {
                const decoded = jwt.decode(token);
                console.log('Decoded Token Expiry:', decoded ? decoded.exp : 'Invalid token');
                return decoded && decoded.exp && decoded.exp > currentTime;
            } catch (err) {
                return false;
            }
        });

        const activeRefreshTokens = tokenDoc.refreshToken.filter(refreshToken => {
            try {
                const decoded = jwt.decode(refreshToken);
                return decoded && decoded.exp && decoded.exp > currentTime;
            } catch (err) {
                return false;
            }
        });

        const deletedAccessTokens = originalAccessTokenCount - activeTokens.length;
        const deletedRefreshTokens = originalRefreshTokenCount - activeRefreshTokens.length;

        if (deletedAccessTokens > 0 || deletedRefreshTokens > 0) {
            console.log(`🧹 Deleted ${deletedAccessTokens} expired/invalid access token(s) and ${deletedRefreshTokens} refresh token(s) for user: ${username}`);
            
            tokenDoc.token = activeTokens;
            tokenDoc.refreshToken = activeRefreshTokens;
            await tokenDoc.save();
            console.log(`✅ Token cleanup completed and saved for user: ${username}`);
        } else {
            console.log(`✅ No expired tokens found for user: ${username}`);
        }

    } catch (error) {
        console.error(`❌ Error cleaning expired tokens for ${username}:`, error);
    }
};

exports.verifyrefereshTokeninDB = async (req, res) => {
    const { username, refreshToken } = req.query;
    try {
        const tokenEntry = await Token_model.findOne({ username, refreshToken });
        res.status(200).json({ valid: !!tokenEntry });
        return !!tokenEntry;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        res.status(500).json({ valid: false, error: 'Internal server error' });
        return false;
    }
};

exports.renew_refresh_token = async (req, res) => {
  try {
    const { username, refreshToken } = req.body;

    // Validate input
    if (!username || !refreshToken) {
      return res.status(400).json({ message: 'Missing username or refresh token' });
    }

    // Detect array or string in schema
    const tokenEntry = await Token_model.findOne({
      username,
      $or: [
        { refreshToken: refreshToken },
        { refreshToken: { $in: [refreshToken] } }
      ]
    });

    if (!tokenEntry) {
      return res.status(404).json({ message: 'User not found or invalid refresh token' });
    }

    // Generate new token
    const newRefreshToken = jwt.sign(
      { id: tokenEntry._id, username: tokenEntry.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Replace token (array or string-safe)
    if (Array.isArray(tokenEntry.refreshToken)) {
      tokenEntry.refreshToken = tokenEntry.refreshToken.filter(t => t !== refreshToken);
      tokenEntry.refreshToken.push(newRefreshToken);
    } else {
      tokenEntry.refreshToken = newRefreshToken;
    }

    await tokenEntry.save();

    res.status(200).json({
      message: 'Refresh token renewed successfully',
      refreshToken: newRefreshToken
    });
    console.log(`old token ${refreshToken} replaced with new token ${newRefreshToken}`, refreshToken, newRefreshToken);

  } catch (error) {
    console.error('Error renewing refresh token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
