import CardProfile from "./(fragments)/CardProfile";

const Profile = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] px-4">
      <CardProfile />
      <div className="text-primary text-subtitle-3 absolute bottom-6">
        {/* © 2024 by sewarna creative */}
      </div>
    </div>
  );
};

export default Profile;
