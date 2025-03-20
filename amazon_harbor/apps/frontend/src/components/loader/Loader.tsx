import ImageBg from "@/assets/img/bg/37.png";

function Loader() {
  return (
    <div className="container-fluid bg-300 dark__bg-1200">
      <div
        className="bg-holder bg-auth-card-overlay"
        style={{ backgroundImage: `url(${ImageBg})` }}
      ></div>
    </div>
  );
}

export default Loader;
