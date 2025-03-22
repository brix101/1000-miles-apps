from app.models.user_model import User
from app.models.cluster_model import Cluster
from typing import List
from app.schemas.cluster_schema import ClusterCreate, ClusterUpdate
from typing import Optional
from bson import ObjectId


class ClusterService:
    @staticmethod
    async def list_clusters() -> List[Cluster]:
        clusters = (
            await Cluster.find({"active": True}, fetch_links=True)
            .sort("+name")
            .to_list()
        )
        return clusters

    @staticmethod
    async def create_cluster(data: ClusterCreate, user: User) -> Cluster:
        cluster = Cluster(**data.dict(), created_by=user)
        return await cluster.insert()

    @staticmethod
    async def get_cluster_by_id(id: str) -> Optional[Cluster]:
        cluster = await Cluster.find_one(Cluster.id == ObjectId(id), fetch_links=True)
        return cluster

    @staticmethod
    async def update_cluster(id: str, data: ClusterUpdate):
        cluster = await ClusterService.get_cluster_by_id(id)
        up_data = data.dict(exclude_unset=True, exclude_none=True)
        fields_to_update = up_data.keys()

        for field in fields_to_update:
            setattr(cluster, field, up_data[field])

        await cluster.save()
        return cluster

    @staticmethod
    async def delete_cluster(id: str):
        cluster = await ClusterService.get_cluster_by_id(id)
        await cluster.update({"$set": {"active": False}})
        await cluster.save()
        return None
