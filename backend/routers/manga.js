const express = require('express')
const { getManga, getBookmarkedMangas, addBookmark, getMangaById, getChaptersByMangaId, getMangaPageByChapter, deleteBookmark } = require('../controllers/MangaController')
const router = express.Router()

router.get('/manga' , getManga)
router.get('/bookmark', getBookmarkedMangas)
router.post('/bookmark', addBookmark)
router.delete('/bookmark/:mangaId' , deleteBookmark)
router.get('/manga/title/:mangaId' , getMangaById)
router.get('/manga/title/:mangaId/chapters' , getChaptersByMangaId)
router.get('/manga/chapter/:chapterId', getMangaPageByChapter)


module.exports = router