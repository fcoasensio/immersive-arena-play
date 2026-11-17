import { useEffect } from "react";
const TagZombi = () => {
  useEffect(() => { document.title = "Tag Zombi · shootandrun"; }, []);
  return <iframe src="/juego/tag-zombi.html" title="Tag Zombi" className="fixed inset-0 w-full h-full border-0" allow="autoplay" />;
};
export default TagZombi;
