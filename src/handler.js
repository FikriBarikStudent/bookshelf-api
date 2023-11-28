const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let booksData = books

  if (name) {
    booksData = booksData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading === '1') {
    booksData = booksData.filter((book) => book.reading === true)
  }

  if (reading === '0') {
    booksData = booksData.filter((book) => book.reading === false)
  }

  if (finished === '1') {
    booksData = booksData.filter((book) => book.finished === true)
  }

  if (finished === '0') {
    booksData = booksData.filter((book) => book.finished === false)
  }

  booksData = booksData.map((book) => {
    const data = {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
    return data
  })

  const response = h.response({
    status: 'success',
    data: {
      books: booksData
    }
  })
  response.code(200)
  return response
}

const getBookHandler = (request, h) => {
  const { bookId } = request.params
  const bookData = books.find((book) => book.id === bookId)

  if (bookData) {
    const response = h.response({
      status: 'success',
      data: {
        book: bookData
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const updateBookHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  const updatedBook = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }

  books[index] = updatedBook

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
    data: {
      book: books[index]
    }
  })
  response.code(200)
  return response
}

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  books.splice(index, 1)

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  })
  response.code(200)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookHandler, updateBookHandler, deleteBookHandler }
