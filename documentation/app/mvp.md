# Music App MVP

## General Idea

The Music Discovery app should surface musicians and tracks that are not famous. The algorith, should boost music that people like, but is not chart topping. The goal is to expose users to new artists, despite how quickly they may be 'upcoming'. For instance, Taylor Swift if she was an artists on the platform, would rarely be recommended, but an artist with less than, say 10k streams would be boosted. The algorithm should also take user reception into consideration, ie, there should be some mechanism for users to indicate whether they like or dislike a song (not necessary with a 'like/dislike' feature), and if that song has not been exposed to many people, it should also be boosted. There should be a (currently unknown) sweet spot of popularity at which the algorithm de-prioritizes an artist and their tracks. In other words, artists that find enough fame should effectively 'age out' of recommendation, paving the way for new, unrecognized talend.

## Pages

### Discover Page

The discover page should display a random set of track pages from various artists. It serves as an entry point into the experience.

### Track Pages/Entries

Track submissions are where users can listen to tracks by artists. These pages should allow the artists to link their tracks from sources such as youtube or soundcloud. If they opt to upload their track to the service (or provide a link it can be streamed from directly), it should play automatically when the user navigates to the page. Tracks should be searchable.

> It might make sense to prioritize tracks that artists upload to the service, to allow for a seamless experience.

### Artist Pages

Artists with tracks on the service should have pages that provide information about them and their music, and link to their tracks on the service. The pages include social links, and information about their albums/tracks/etc.

### Jam/Mix Page

This page queues up (weighted) random tracks for the user to listen to, uninterupted. The selections must be either available from the service, or to the service (ie, can be embedded and play automatically). Users can filter their mixes by genre and exclude certain artists.

### User Settings

The settings page allows users to modify their account information

## The algorithm

As mentioned, the algorithm should surface artists that are lesser-known, instead of massively popular. If, for instance, Taylor Swift was on the platform and a user listened to every song on the platform, her tracks would be toward the end of that of experience, due to her popularity and the amount of streams her songs accrue. While the algorithm should favor lesser-known artists, it should also avoid artists that can reasonably considered low quality or artificial. Low quality in this case means:

- Tracks that are not intended to be music (ie, sounds of rain, beaches, forests, random sfx, etc)
- Tracks that are just silence or plain white noise

## Ai Policy

Tracks that have been created with generative AI are not allowed to be uploaded or added to the catalogue. AI can be used in the process, but there must be a significant amount of human work that went into making the track (ie, using AI for mastering)

## Track submissions

For costs considerations, artists will be able to upload only a few tracks. A side effect of this is that the service should be able to select from a wider range of artists, Artists will be able to rotate tracks, and systems should be in place to prevent 'evergreening' (ie, deleting and reuploading the same track to bump its weighting). This would apply only to uploaded tracks; artists should still be able to submit tracks for pages containing only links.
