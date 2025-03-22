function AvatarContainer({ name }: { name: string }) {
  const icon = name?.charAt(0);
  return (
    <div className="avatar-name">
      <span>{icon}</span>
    </div>
  );
}

export default AvatarContainer;
