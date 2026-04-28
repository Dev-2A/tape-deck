import { useCallback } from "react";

/**
 * JSON 객체를 파일로 다운로드한다.
 *
 * 사용:
 *   const downloadJSON = useFileDownload()
 *   downloadJSON(payload, 'backup.json')
 */
export function useFileDownload() {
  return useCallback((payload, filename = "export.json") => {
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Blob URL 메모리 해제
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);
}
