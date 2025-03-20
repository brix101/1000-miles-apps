export interface AvatarContainerProps {
  name: string;
}

function AvatarContainer({ name }: AvatarContainerProps) {
  const icon = name?.charAt(0);

  return (
    <div className="avatar-name rounded-circle">
      <span>{icon}</span>
    </div>
  );
}

export default AvatarContainer;
