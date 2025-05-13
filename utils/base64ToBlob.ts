export function base64ToBlob(base64String: string): Blob {
    const [metadata, data] = base64String.split(',');
    const contentType = metadata.match(/data:(.*);base64/)?.[1];
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
        byteCharacters.charCodeAt(i)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}
