# Working With Multi-Container Projects

So far in this article, you've only worked with single container projects. But in real life, majority of the projects that you'll have to work with will have at least more than one container and to be honest, working with a bunch of containers can be a little difficult if you don't understand the nuances of container isolation. So in this section of the article you'll get familiar with basic networking with Docker and will work hands on with a small multi-container project.

The first question that I would like to answer in this section is **how does a multi-container project differ from a single container project and what makes it more difficult?**

Well you've already learned in the previous section that containers are isolated environment. Now consider a scenario where you have a `notes-api` application powered by [Express.js](https://expressjs.com/) and a [PostgreSQL](https://www.postgresql.org/) database server running in two separate containers.

These two containers are completely isolated from each other and oblivious about each other's existence. **So the question is how do you connect the two? Ain't that a challenge?**

Well you may think that's easy. I'll just expose a port from the `postgres` container and the `notes-api` will connect through that. Assuming that the exposed port from the `postgres` container is 5432. Now if you try to connect to `127.0.0.1:5432` from inside the `notes-api` container, you'll find that

The answer is, **you connect them by putting them under the same network.** Before I take you deeper into the rabbit hole, let me first explain some of the basic theory behind Docker's network.

