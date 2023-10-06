module.exports = async (search) => {
  const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN

  const res = await fetch(`https://api.genius.com/search?q=${search}&access_token=${ACCESS_TOKEN}`)

  const searchResults = await res.json()
  const hits = searchResults.response.hits

  if (hits.length === 0) return null

  return hits[0].result
}
