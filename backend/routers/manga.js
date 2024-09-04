const express = require('express')
const { getManga, getBookmarkedMangas, addBookmark, getChapterFromManga, getMangaById, getChaptersByMangaId, getMangaPageByChapter } = require('../controllers/MangaController')
const router = express.Router()

router.get('/manga' , getManga)
router.get('/manga/bookmark', getBookmarkedMangas)
router.post('/manga/bookmark', addBookmark)
router.delete('/manga/bookmark/:mangaId')
router.get('/manga/title/:mangaId' , getMangaById)
router.get('/manga/title/:mangaId/chapters' , getChaptersByMangaId)
router.get('/manga/chapter/:chapterId', getMangaPageByChapter)

module.exports = router