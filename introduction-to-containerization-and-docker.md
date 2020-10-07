# Introduction to Containerization and Docker

According to [IBM](https://www.ibm.com/cloud/learn/containerization#toc-what-is-co-r25Smlqq) - "Containerization involves encapsulating or packaging up software code and all its dependencies so that it can run uniformly and consistently on any infrastructure."

In other words, containerization let's you bundle up your software along with all it's dependencies in a self-contained package so that it can be run without going through a troublesome setup process.

Let's consider a real life scenario here. Assume you have developed an awesome book management application that can store information regarding all the books that you own and can also serve the purpose of a book lending system for your friends.

Now if you make a list of the dependencies, that list will be as follows:

* Node.js
* Express.js
* SQLite3

Well theoretically this should be it. But practically there is other stuff as well. [Node.js](https://nodejs.org/) uses a build tool known as `node-gyp` for building native add-ons and according to the [installation instruction](https://github.com/nodejs/node-gyp#installation) in the [official repository](https://github.com/nodejs/node-gyp), this build tool requires Python 2/3 and a proper C/C++ compiler tool-chain. Taking all these into account, the final list of dependencies as follows:

* Node.js
* Express.js
* SQLite3
* Python 2/3
* C/C++ tool-chain

Installing Python 2/3 is pretty straight forward regardless of the platform you're on. A C/C++ tool-chain is pretty easy to setup on Linux but on Windows and Mac, it's painful task. On Windows, the C++ build tools package measures at gigabytes and takes quite some time to install. On a Mac, there are two ways to get it done. You either install the gigantic [Xcode](https://developer.apple.com/xcode/) package or you install the much smaller [Command Line Tools for Xcode](https://developer.apple.com/downloads/) package. Regardless the one you install, it may break on OS updates. In fact the problem is so prevalent that there are [Installation notes for macOS Catalina](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md) available on the official repository.

Now let's assume that you've gone through all the hassles of setting up the dependencies and have started working on the project. Does that mean you're out of danger now? Of course not.

What if you have a colleague who uses Windows while you're using Linux. Now you have to consider the inconsistencies of how these two different operating systems handle environment variables and paths.

What if the person responsible for managing the servers doesn't have much knowledge on deploying Node.js applications or follows the wrong procedure \(because there is no one size fits all deployment process\)?

All these issues can be solved if only you can somehow put your application inside a single file \(known as an image\) along with all it's dependencies, necessary configurations and share it through a central server \(known as a registry\) that is accessible by anyone with the proper authorization. That's what containerization allows you to do.

Your colleagues, then will be able to download the file, run it as it is and even deploy directly to a server because the application is already configured properly inside that image.

#### Now the question is where does Docker come in?

As I've already explained, containerization is an idea that makes your applications more portable by putting them into boxes. This very idea has quite a few implementations. Docker is such an implementation. It's an open-source containerization platform that allows you to containerize your applications, share them using public or private registries and also to orchestrate them.

Now, Docker is not the only containerization tool on the market, it's just the most popular one. Another containerization engine that I like is called [rkt](https://coreos.com/rkt/) or rocket. Developed by the amazing [CoreOS](https://coreos.com/) \(now part of Red Hat\) team, rkt is a security oriented container engine. rkt takes a pod native approach to containerization and was once the default container engine for Kubernetes.

If you're curious about the other possible choices you have on the containerization scene, you may checkout the [rkt vs other projects](https://coreos.com/rkt/docs/latest/rkt-vs-other-projects.html) page on rkt's official documentation which covers almost all the good options.

Also, if you want some history lessons, you may read the amazing [A Brief History of Containers: From the 1970s Till Now](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016) article which covers most of the major turning points for the technology.



