import ComparisonReport from "@/components/comparison-report";
import Report from "@/components/report";
import SegmentedImage from "@/components/segmented-image";

export default function Page() {
  return (
    <div>
      <div className=""></div>
      <p>This is the segmented page</p>
      <SegmentedImage />
      <Report />
      <ComparisonReport />
    </div>
  );
}
