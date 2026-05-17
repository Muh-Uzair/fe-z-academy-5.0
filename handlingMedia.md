## Media Handling Rules

`1.` All images, videos, and other media assets in the app should be uploaded to AWS S3.

`2.` The backend should store only the final public media URL or object key metadata needed to rebuild that URL. Raw file binaries must not be stored in the database.

`3.` The frontend should collect media from the user through a file input, not by asking users to paste public URLs for normal create or update flows.

`4.` When a media file is selected, the frontend may create a local preview with `URL.createObjectURL(file)` so the user can review the asset before upload.

`5.` Local preview URLs are temporary UI-only values. They must never be sent to the backend as the final stored media URL.

`6.` For production upload flows, the frontend should request a presigned URL from the backend, upload the selected file directly to S3, then send the final public URL in the actual create or update request.

`7.` If a screen is currently static UI only, it may log the selected `File` object and use a local preview URL for interface feedback, but that preview URL should be treated as a temporary placeholder until the real S3 flow is connected.

`8.` Allowed file types must be validated on the client before upload. For category images, the allowed types are `.jpg`, `.jpeg`, and `.png`.

`9.` Media upload UI should show a preview area with a consistent aspect ratio whenever the design requires predictable presentation. Category images should default to a `16 / 9` ratio using the shared `AspectRatio` component.

`10.` In view mode, users should see the currently stored media asset. In edit mode, users should be allowed to replace that asset with a new local file selection.

`11.` If a user replaces a selected file before saving, the old unsaved local preview should be discarded so the UI always reflects the latest chosen file.

`12.` Shared media behavior should be implemented in reusable components or reusable form patterns so create, view, and update flows stay consistent across the app.
