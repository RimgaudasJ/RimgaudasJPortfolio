
const params = new URLSearchParams(window.location.search);
console.log(params.toString());
const blogId = params.get('id');
fetch(`blogs/${blogId}.json`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('blog-container');
    container.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
  })
  .catch(() => {
    document.getElementById('blog-container').innerHTML = "Blog not found.";
  });
