from app.models.user_model import User
from app.models.excluded_word_model import ExcludedWord
from typing import List
from app.schemas.excluded_word_schema import ExcludedWordCreate, ExcludedWordUpdate
from typing import Optional
from bson import ObjectId


class ExcludedWordService:
    @staticmethod
    async def list_words(user: User) -> List[ExcludedWord]:
        words = await ExcludedWord.find({"active": True}).sort("+word").to_list()
        return words

    @staticmethod
    async def create_word(data: ExcludedWordCreate, user: User) -> ExcludedWord:
        new_words = []
        for word in data.words:
            word = word.lower()
            old_word = await ExcludedWord.find_one(ExcludedWord.word == word)
            if not old_word:
                excluded_word = ExcludedWord(word=word, active=True)
                new_word = await excluded_word.insert()
                new_words.append(new_word)
            else:
                await old_word.update({"$set": {"active": True}})
                await old_word.save()
                new_words.append(old_word)

        return new_words

    @staticmethod
    async def get_excluded_word_by_id(id: str) -> Optional[ExcludedWord]:
        excludedWord = await ExcludedWord.find_one(ExcludedWord.id == ObjectId(id))
        return excludedWord

    @staticmethod
    async def update_word(id: str, data: ExcludedWordUpdate, current_user: User):
        excluded_word = await ExcludedWordService.get_excluded_word_by_id(id)
        await excluded_word.update({"$set": data.dict(exclude_unset=True)})
        await excluded_word.save()
        return excluded_word

    @staticmethod
    async def delete_word(id: str, current_user: User):
        excluded_word = await ExcludedWordService.get_excluded_word_by_id(id)
        await excluded_word.update({"$set": {"active": False}})
        await excluded_word.save()
        return None
