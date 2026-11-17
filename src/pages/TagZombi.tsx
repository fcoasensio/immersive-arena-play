import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const TagZombi = () => {
  useEffect(() => { document.title = "Tag Zombi · shootandrun"; }, []);
  return (
    <>
      <iframe src="/juego/tag-zombi.html" title="Tag Zombi" className="fixed inset-0 w-full h-full border-0" allow="autoplay" />
      <Link
        to="/"
        aria-label="Salir del juego"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-md border border-border bg-background/80 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur hover:bg-background"
      >
        <X size={16} /> Salir
      </Link>
    </>
  );
};
export default TagZombi;
