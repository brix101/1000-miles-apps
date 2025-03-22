from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.user_deps import get_current_user
from app.models.user_model import User
from app.models.cluster_model import Cluster
from app.schemas.cluster_schema import ClusterCreate, ClusterUpdate
from app.services.cluster_service import ClusterService

cluster_router = APIRouter()


@cluster_router.get("/", summary="Get all cluster")
async def clusters(_: User = Depends(get_current_user)):
    cluster = await ClusterService.list_clusters()
    return cluster


@cluster_router.get("/{id}", summary="Get cluster")
async def get_cluster(id: str, _: User = Depends(get_current_user)):
    cluster = await ClusterService.get_cluster_by_id(id=id)
    return cluster


@cluster_router.post("/", summary="Create cluster")
async def create_cluster(
    data: ClusterCreate, current_user: User = Depends(get_current_user)
):
    cluster = await ClusterService.create_cluster(data, current_user)
    return cluster.dict()


@cluster_router.put("/{id}", summary="Update cluster")
async def update_cluster(
    id: str, data: ClusterUpdate, _: User = Depends(get_current_user)
):
    try:
        cluster = await ClusterService.update_cluster(id, data)
        return cluster.dict()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update",
        )


@cluster_router.delete("/{id}", summary="Delete cluster")
async def delete_cluster(id: str, _: User = Depends(get_current_user)):
    await ClusterService.delete_cluster(id)
    return {"status": "success"}
