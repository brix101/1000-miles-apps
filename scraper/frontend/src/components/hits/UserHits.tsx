import UserRow from "@/components/rows/UserRow";
import { UserEntity } from "@/schema/user.schema";
import { useQueryUsers } from "@/services/user.service";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { useHits } from "react-instantsearch-hooks-web";

function UserHits() {
  const { hits } = useHits<UserEntity>();
  const { data } = useQueryUsers();

  const users: AlgoliaHit<UserEntity>[] = hits.map((user) => {
    const matchedUser = data?.users.find((u) => u.id === user.id);
    return { ...user, ...(matchedUser || {}) };
  });

  return (
    <tbody className="list" id="users-table-body">
      {users?.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </tbody>
  );
}

export default UserHits;
