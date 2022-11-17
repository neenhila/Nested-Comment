const comments = [{
    author: "alihan",
    text: "Hello, this first comment is a comment I added manually to array. I didn't care about styling because I thought the logic of this test was about nested comments.",
    timestamp: "20.48",
    commentId: 1,
    isReply: false,
    repliedTo: null,
    replies: [],
    votes: {
      upvote: 0,
      downvote: 0,
    },
  }, ];

  const viewComment = [];
  let container = document.getElementById("container");

  setInterval(async () => {
    comments.forEach((comment) => {
      if (viewComment.includes(comment.commentId)) {
        let upvote = document.getElementById(`upvote-${comment.commentId}`);
        let downvote = document.getElementById(`downvote-${comment.commentId}`);
        upvote.innerText = comment.votes.upvote + " +";
        downvote.innerText = comment.votes.downvote + " -";
        if (comment.isReply) return;
        if (comment.replies.length > 0) {
          comment.replies.forEach(async (item) => {
            if (viewComment.includes(item.id)) return;
            if (comments.includes(item)) return;
            comments.splice(comments.indexOf(comment) + 1, 0, item);
            setTimeout(async () => {
              await refreshCommentQueue();
            }, 500);
          });
        } else return;
      } else {
        if (comment.isReply) {
          let createdCommentHTML = `
      <div class="comment" style="margin-left: 150px; border: 1px solid blue" id="comment${comment.commentId}">
      <div class="text">
        ${comment.text}
      </div>
      <div class="author">"${comment.author}"</div>
      <div class="timestamp">${comment.timestamp}</div>
      <div class="votes">
        <div class="upvote" id="upvote-${comment.commentId}">${comment.votes.upvote} +</div>
        <div class="downvote" id="downvote-${comment.commentId}">${comment.votes.downvote} -</div>
      </div>
    </div>
      `;
          viewComment.push(comment.commentId);
          container.innerHTML += createdCommentHTML;
        } else {
          let createdCommentHTML = `
      <div class="comment" id="comment${comment.commentId}">
      <div class="text">
        ${comment.text}
      </div>
      <div class="author">"${comment.author}"</div>
      <div class="timestamp">${comment.timestamp}</div>
      <div class="reply" id="reply-${comment.commentId}">Reply</div>
      <div class="votes">
        <div class="upvote" id="upvote-${comment.commentId}">${comment.votes.upvote} +</div>
        <div class="downvote" id="downvote-${comment.commentId}">${comment.votes.downvote} -</div>
      </div>
    </div>
      `;

          viewComment.push(comment.commentId);
          container.innerHTML += createdCommentHTML;
        }
      }
    });
  }, 1000);

  // end of refresh on new comment & nested logic
  var replyingTo = 0;
  let info = document.getElementById("info");
  document.addEventListener("click", (e) => {
    if (!e.target.id.startsWith("reply")) return;
    if (replyingTo === +e.target.id.slice(6, e.target.id.length)) {
      replyingTo = 0;
    } else {
      replyingTo = +e.target.id.slice(6, e.target.id.length);
    }
  });

  setInterval(() => {
    if (replyingTo > 0) {
      let comment = comments.find((item) => item.commentId === replyingTo);
      let author = comment.author;
      info.innerHTML = `You're replying to <span style="font-color: red; font-weight: bold;">${author}</span>`;
    } else {
      info.innerHTML = "";
    }
  }, 200);

  // end of replying logic

  // ----------------------------------------------------------

  // new comment & vote logic

  let newComment = document.getElementById("newComment");
  let btn = document.getElementById("newCommentBtn");
  let author = document.getElementById("author");

  btn.addEventListener("click", async (e) => {
    if (newComment.value.length < 1) return alert("Comment needed.");
    if (author.value.length < 1) return alert("Nice to meet you nameless.");
    if (replyingTo > 0) {
      let dateNow = Date.now();
      const date = new Date(dateNow).toLocaleDateString("tr-TR", {
        hour: "numeric",
        minute: "numeric",
      });
      let comment = {
        author: author.value,
        text: newComment.value,
        timestamp: date,
        commentId: comments.length + 1,
        isReply: true,
        repliedTo: replyingTo,
        votes: {
          upvote: 0,
          downvote: 0,
        },
      };

      let cm = comments.find((c) => c.commentId === replyingTo);
      cm.replies.push(comment);
      await refreshCommentQueue();
    } else {
      let dateNow = Date.now();
      const date = new Date(dateNow).toLocaleDateString("tr-TR", {
        hour: "numeric",
        minute: "numeric",
      });
      let comment = {
        author: author.value,
        text: newComment.value,
        timestamp: date,
        commentId: comments.length + 1,
        isReply: false,
        repliedTo: null,
        replies: [],
        votes: {
          upvote: 0,
          downvote: 0,
        },
      };

      comments.push(comment);
    }

    newComment.value = "";
    author.value = "";
  });

  async function refreshCommentQueue() {
    container.innerHTML = "";
    viewComment.length = 0;
  }

  // vote

  document.addEventListener("click", (e) => {
    if (e.target.id.startsWith("upvote")) {
      if (author.value.length < 1)
        return alert(
          "You can't use a vote without name, provide a name in nickname label."
        );
      let id = +e.target.id.slice(7, e.target.id.length);
      let cm = comments.find((comment) => comment.commentId === id);

      cm.votes.upvote += 1;
    }
    if (e.target.id.startsWith("downvote")) {
      if (author.value.length < 1)
        return alert(
          "You can't use a vote without name, provide a name in nickname label."
        );
      let id = +e.target.id.slice(9, e.target.id.length);
      let cm = comments.find((comment) => comment.commentId === id);
      console.log(cm.votes.downvote);
      cm.votes.downvote += 1;
    }
  });