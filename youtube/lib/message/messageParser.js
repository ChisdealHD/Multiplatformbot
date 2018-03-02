module.exports = item => {
    return {
        kind: item.kind,
        etag: item.etag,
        id: item.id,
        snippet: {
            type: item.snippet.type,
            chatID: item.snippet.liveChatId,
            authorChannelID: item.snippet.authorChannelId,
            timestamp: item.snippet.publishedAt,
            display: item.snippet.displayMessage,
            content: item.snippet.textMessageDetails.messageText
        },
        author: {
            channelId: item.authorDetails.channelId,
            channelUrl: item.authorDetails.channelUrl,
            displayName: item.authorDetails.displayName,
            profileImageUrl: item.authorDetails.profileImageUrl,
            isVerified: item.authorDetails.isVerified,
            isChatOwner: item.authorDetails.isChatOwner,
            isChatSponsor: item.authorDetails.isChatSponsor,
            isChatModerator: item.authorDetails.isChatModerator
        }
    }
}