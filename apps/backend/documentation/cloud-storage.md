# Cloud Storage

## Images

Images are stored at consistent paths depending on their type. The types of images are `albumArt`, `artistArt`, and `trackArt`. Images should be located in storage at `<username>/<image type>/<resource name>`, where the `resource name` is a track title, album title, or artist name. Username and resource name are snake-cased. This should make storage straightforward and deletion/replacement/etc easier to reason about.
