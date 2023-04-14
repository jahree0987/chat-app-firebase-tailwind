export const Profile = (props) => {
  const { name, photo } = props;
  return (
    <div className="profile bg-zinc-500 flex p-5 w-full">
      <img src={photo} className="rounded-full"/>
      <h3 className="text-6xl ml-5 capitalize p-5 text-white" >{name}</h3>
    </div>
  );
};
