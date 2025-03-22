from app.models.user_model import User
from app.models.syn_plural_model import SynonymPlural
from typing import List
from app.schemas.syn_plural_schema import SynonymPluralCreate, SynonymPluralUpdate, AddSynoynym, AddPlural, RemoveSynoynymPlural
from typing import Optional
from bson import ObjectId

class SynonymPluralService:
    @staticmethod
    async def list_synonym_plural(user: User) -> List[SynonymPlural]:
        syn_plural = await SynonymPlural.find({"active":True}, fetch_links=True).sort("+word").to_list()
        return syn_plural
    
    @staticmethod
    async def create_synonym_plural(data: SynonymPluralCreate, user: User,) -> SynonymPlural:
        data = data.dict()
        data['word'] = data['word'].lower()
        syn_plural = SynonymPlural(**data)
        syn_plural = await syn_plural.insert()
        return await SynonymPluralService.get_syn_plural_by_id(str(syn_plural.id))
    
    @staticmethod
    async def get_syn_plural_by_id(id: str) -> Optional[SynonymPlural]:
        syn_plural =await SynonymPlural.find_one(SynonymPlural.id == ObjectId(id), fetch_links=True)
        return syn_plural
    
    @staticmethod
    async def update_synonym_plural(id: str, data: SynonymPluralUpdate, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        await syn_plural.update({"$set": data.dict(exclude_unset=True)})
        await syn_plural.save()
        return syn_plural
    
    @staticmethod
    async def delete_synonym_plural(id: str, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        await syn_plural.update({"$set": {"active": False}})
        await syn_plural.save()
        return None
    
    @staticmethod
    async def add_synonyms(id: str, data: AddSynoynym, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        temp = data.dict(exclude_unset=True)
        synonyms = [sn.lower() for sn in temp['synonyms']]
        syn_plural.synonyms.extend(synonyms) 
        await syn_plural.save()
        return syn_plural
    
    @staticmethod
    async def add_plural(id: str, data: AddPlural, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        temp = data.dict(exclude_unset=True)
        plurals = [pl.lower() for pl in temp['plural']]
        syn_plural.plural.extend(plurals)
        await syn_plural.save()
        return syn_plural
    
    @staticmethod
    async def delete_synonym(id: str, data:RemoveSynoynymPlural, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        [syn_plural.synonyms.remove(word) for word in data.words]
        await syn_plural.save()
        return syn_plural
    
    @staticmethod
    async def delete_plural(id: str, data:RemoveSynoynymPlural, current_user: User):
        syn_plural = await SynonymPluralService.get_syn_plural_by_id(id)
        [syn_plural.plural.remove(word) for word in data.words]
        await syn_plural.save()
        return syn_plural
