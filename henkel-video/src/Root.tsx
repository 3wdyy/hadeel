import { Composition } from "remotion";
import { HenkelGCCVideo } from "./HenkelGCCVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HenkelGCC"
        component={HenkelGCCVideo}
        durationInFrames={30 * 75} // 75 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
