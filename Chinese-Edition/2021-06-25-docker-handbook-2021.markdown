# 目录

- [0. 前言](#0)
- [1. 准备](#1)
- [2. 容器化(Containerization)和Docker简介](#2)
- [3. 怎么样安装Docker](#3)
    - [3.1 怎么在macOS系统上安装Docker](#3.1)
    - [3.2 怎么在Windows系统上安装Docker](#3.2)
    - [3.3 怎么在Linux系统上安装Docker](#3.3)
- [4. Docker运行Hello World - Docker基本介绍](#4)
    - [4.1 什么是容器？](#4.1)
    - [4.2 什么是镜像？](#4.2)
    - [4.3 什么是Docker仓库（Docker Registry）？](#4.3)
    - [4.4. Docker架构](#4.4)
    - [4.5. 完整的Docker工作过程](#4.5)
- [5. Docker容器基本操作](#5)
    - [5.1 怎样运行一个容器？](#5.1)
    - [5.2 怎样发布一个端口？](#5.2)
    - [5.3 怎样使用后台模式？](#5.3)
    - [5.4 怎样查看容器？](#5.4)
    - [5.5 怎样命名或者重命名一个容器？](#5.5)
    - [5.6 怎样停止或者杀死一个运行中的容器？](#5.6)
    - [5.7 怎样重启一个容器？](#5.7)
    - [5.8 怎样不启动容器的情况下创建一个容器？](#5.8)
    - [5.9 怎样移除一个不用的容器？](#5.9)
    - [5.10 怎样使用命令行交互的方式启动一个容器？](#5.10)
    - [5.11 怎样在容器内执行命令？](#5.11)
    - [5.12 怎样操作可执行镜像？](#5.12)
- [6. Docker镜像基本操作](#6)
    - [6.1 怎样创建一个Docker镜像？](#6.1)
    - [6.2 怎样给镜像打标签？](#6.2)
    - [6.3 怎样展示和删除镜像？](#6.3)
    - [6.4 怎样理解多层镜像？](#6.4)
    - [6.5 怎样从源代码构建NGINX？](#6.5)
    - [6.6 怎样优化一个Docker镜像？](#6.6)
    - [6.7 拥抱Alpine Linxu](#6.7)
    - [6.8 怎样创建一个可执行Docker镜像？](#6.8)
    - [6.9 怎样在线共享你的镜像？](#6.9)
- [7. 怎样容器化一个Javascript应用？](#7)
    - [7.1 怎么写Dockerfile？](#7.1)
    - [7.2 怎么在Docker中进行Bind Mounts(绑定挂载)？](#7.2)
    - [7.3 怎么使用Docker的匿名卷？](#7.3)
    - [7.4 怎么在Docker中执行多阶段构建（Multi-Staged Builds）？](#7.4)
    - [7.5 怎么忽略掉不必要的文件？](#7.5)
- [8. Docker中的网络操作](#8)
    - [8.1 Docker网络基础](#8.1)
    - [8.2 怎样在Docker中自定义一个桥接网络？](#8.2)
    - [8.3 怎样在Docker中附接一个容器到网络中？](#8.3)
    - [8.4 怎样在Docker中将容器从网络中断开连接？](#8.4)
    - [8.5 怎样在Docker中删除网络？](#8.5)
- [9. 怎样容器化配置一个多容器JavaScript应用？](#9)
    - [9.1 怎样运行一个数据库服务？](#9.1)
    - [9.2 怎样在Docker中使用实名卷？](#9.2)
    - [9.3 怎样在Docker中查看容器的日志？](#9.3)
    - [9.4 怎样在Docker中创建一个网络并且将数据库容器附接到网络中？](#9.4)
    - [9.5 怎样写Dockerfile？](#9.5)
    - [9.6 怎样在运行的容器中执行命令？](#9.6)
    - [9.7 怎样写管理Docker的脚本？](#9.7)
- [10. 怎样使用Docker-Compose？](#10)
    - [10.1 Docker Compose基础](#10.1)
    - [10.2 Docker Compose中如何启动服务？](#10.2)
    - [10.3 Docker Compose如何展示服务？](#10.3)
    - [10.4 怎样在Docker Compose运行的服务中执行命令？](#10.4)
    - [10.5 怎样在Docker Compose中查看运行的服务的日志？](#10.5)
    - [10.6 怎样在Docker Compose中停止运行的服务？](#10.6)
    - [10.7 怎样Compose一个全栈应用？](#10.7)
- [11. 结论](#11)
- [12. 译者注](#12)

---

<h2 id="0">0. 前言</h2>

容器化是一个相当古老的技术，2013年[Docker Engine](https://docs.docker.com/get-started/overview/#docker-engine)的出现让一个应用容器化变得更加简单。

根据[Stack Overflow开发者调查](https://insights.stackoverflow.com/survey/2020#overview)，2020年[Docker](https://docker.com/)是[最被需要](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-platforms-wanted5)、[最受喜爱](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-platforms-loved5)和[最流行](https://insights.stackoverflow.com/survey/2020#technology-platforms)的平台。

Docker技术如此流行，似乎我们不得不学习它。因此，本指南囊括有从基本到中级的容器化技术。通过本指南你应该学习到：几乎基于所有平台的容器化；上传一个自定义的Docker镜像(Image)到在线仓库(registry)；使用docker-compose协作多个容器。

---

<h2 id="1">1. 准备</h2>

- 熟悉Linux命令行操作
- 熟悉JavaScript语言(后续的项目中使用到了JavaScript)

<h2 id="2">2. 容器化(Containerization)和Docker简介</h2>

[IBM](https://www.ibm.com/cloud/learn/containerization#toc-what-is-co-r25Smlqq)指出：容器化技术就是将软件代码和其所有的依赖打包或者封装，使其统一能够在任何平台上持续运行的技术。

换句话说，容器技术就是能够让你把软件和其依赖打包在一个自包含的包中，这样软件运行的时候就不必解决启动依赖的一些问题。

让我们考虑一个实际的生活场景，假设你开发了一个神奇的图书管理系统，你也可以向你的朋友提供书籍的借阅功能。如果把这个系统的依赖都列出来，可能是这样的：

- Node.js
- Express.js
- SQLite3

理论上来讲，应该就是这些依赖了，但是实际上并不止这些。我们知道[Node.js](https://nodejs.org/)使用一个叫做`node-gyp`的构建工具用来构建本地插件，并且根据[官方仓库](https://github.com/nodejs/node-gyp)的[安装文档](https://github.com/nodejs/node-gyp#installation)，这个构建工具需要`Python`2或者3和一个合适的c/c++编译器。

这样说来，最终的依赖列表可能是这样的：

- Node.js
- Express.js
- SQLite3
- Pytho2 or 3
- c/c++ 编译器

在任何平台安装`Python`2或者3都比较简单。在Linux平台上安装c/c++编译器比较容易，但是在Windows和Mac系统上安装就是一个痛苦的过程了。

在Windows中，C++编译器有超过1G的大小，需要花费不少的时间安装。在Mac系统中，你需要安装[Xcode](https://developer.apple.com/xcode/)或者体量小的[Xcode命令行工具](https://developer.apple.com/downloads/)。

尽管你安装好了依赖，在OS更新后，你的依赖可能被破坏。事实上，在macOS系统上，这个问题如此常见，以至于在官方的仓库中记录着[安装日志](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md)。

让我们假设你克服了重重困难安装好了开发应用的所有依赖，你认为现在就万事大吉了吗？还没有。

如果你的同事使用的Windows系统开发，而你使用的是macOS系统，你需要考虑两个操作系统对文件路径的差异处理。再或者说[Nginx](https://nginx.org/)并没有很好的针对Windows系统做优化。一些技术例如[Redis](https://redis.io/)甚至没有Windows系统的预编译包。

即使项目已经开发完成，如果部署人员不清楚部署的流程呢？

如果采用下面的办法，所有上面的问题都能够被解决：

- 在和你最终部署环境匹配的隔离环境（所谓的容器）中开发（部署）并运行系统。
- 把你的应用和其所有的依赖及配置打包为一个单文件（所谓的镜像）。
- 通过一个中央服务器（所谓的仓库）分享应用给有合适权限的人。

你的同事们可以从中央仓库中下载镜像，启动应用时不用担心环境的不一致的问题，甚至可以直接启动应用，因为镜像中可能已经做好了相关配置。

这就是容器化的概念：将你的应用（和依赖）打包在一个自包含的镜像中，这个镜像是轻量级的并且可以在不同的环境中复制。

那么，现在的问题是：**Docker 到底是做什么的？**

就像我上面说的，容器化技术就是通过将应用的环境、依赖和配置封装在一个黑盒子中，来解决应用部署时千千万万的问题。

容器化技术已经有一些实现，[Docker](https://www.docker.com/)是其中的一种。它是一个开源的容器平台，能够将你的应用容器化，通过私有或者公共仓库分享，并且还可以让这些[容器协作起来](https://docs.docker.com/get-started/orchestration/)。

如今，Docker不是市面上唯一的容器化工具，但它是最流行的一个。另一个我喜爱的容器化平台是红帽公司开发的[Podman](https://podman.io/)。其他的容器化工具像Google的[Kaniko](https://github.com/GoogleContainerTools/kaniko)，CoreOS的[rkt](https://coreos.com/rkt/)也很优秀，但是暂时还不是Docker的可替代的工具。

如果你想了解容器化的历史，你可以读一下[A Brief History of Containers:From the 1970s Till Now](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016)这个经典介绍，里面介绍了容器化技术的重要演变过程。

---

<h2 id="3">3.怎么样安装Docker</h2>

根据操作系统的不同，安装的Docker的方法也不相同，但是总体来说，安装过程是比较简单的。

Docker能够运行在不同的主流操作系统macOS、Windows和Linux上，在这三个平台上，macOS系统上安装最容易，所以我们就从macOS系统开始。

<h3 id="3.1">3.1 怎么在macOS系统上安装Docker</h3>

在macOS上，你首先要做的就是找到官网的[下载地址](https://www.docker.com/products/docker-desktop)并下载一个mac平台的稳定版本。

你将会得到一个macOS系统的安装包并将它拖拽一个应用程序文件夹中。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-01.jpg)

你可以双击安装包，一旦应用启动成功，你会在菜单栏中看到Docker的图标。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-02.jpg)

现在，打开命令行终端并且执行`docker --version`和`docker-compose --version`命令来验证Docker的安装是否成功。

<h3 id="3.2">3.2 怎么在Windows系统上安装Docker</h3>

在Windows系统上除了额外的步骤要执行以外，其他的步骤和在macOS系统上大体一致。安装的步骤如下：

1. 访问[该网址](https://docs.microsoft.com/en-us/windows/wsl/install-win10)，并且按照指示在Windows10系统上安装WSL2。
2. 找到官方网站[下载页](https://www.docker.com/products/docker-desktop)，下载Windows平台的稳定版本。
3. 双击安装包，根据引导默认完成安装。

安装完成后，你可以从桌面或者开始菜单中打开Docker，你的Docker就会出现在任务栏中。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-03_1.jpg)

现在，可以打开你从Microsoft Store中安装的Ubuntu或者任何发行版，执行`docker --version`和`docker-compose --version`命令来验证Docker的安装是否成功。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-03.jpg)

你也可以打开cmd或者Power shell命令行终端来验证，只是在Windows上我喜欢WSL2命令行工具。

<h3 id="3.3">3.3 怎么在Linux系统上安装Docker</h3>

在Linux系统上安装Docker和上面两个系统完全不同，并且你使用Linux发行版不同，安装方式也不相同。但实际上，安装过程也很简单。

在Windows或者macOS系统上的Docker桌面安装包是包含像Docker Engine, Docker Compose, Docker Dashboard, Kubernetes等工具的集合包。然而在Linux操作系统上，没有这样捆绑一起的包，你需要手动安装你需要的工具包。不同平台的安装过程如下：

- 如果你是Ubuntu系统，你可以按照[Ubuntu官网文档指示安装Docker Engine](https://docs.docker.com/engine/install/ubuntu/)。
- 其他不同的Linux发行版，你也能从官方文档中获取安装指示。
    - [Debian系统上安装Docker](https://docs.docker.com/engine/install/debian/)
    - [Fedora系统上安装Docker](https://docs.docker.com/engine/install/fedora/)
    - [Centos系统上安装Docker](https://docs.docker.com/engine/install/centos/)
- 如果官方文档中没有你使用发行版的说明，你需要按照[二进制编译安装的指示](https://docs.docker.com/engine/install/binaries/)进行安装。
- 无论你怎么样安装，一些针对[Linux系统安装后必须执行的步骤](https://docs.docker.com/engine/install/linux-postinstall/)是很重要的。
- 在你完成了Docker的安装，你还需要安装Docker Composed，你可以从官方文档中获取[安装Docker Composed的说明](https://docs.docker.com/compose/install/)。

安装完成后，打开命令行终端并且执行`docker --version`和`docker-compose --version`命令来验证Docker的安装是否成功。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-04.jpg "该图为冯兄译者本书命令操作环境图")

尽管Docker能够在不同的平台上使用，我还是更倾向于在Linux上使用，本书中我将使用[Ubuntu20.04](https://releases.ubuntu.com/20.04/)和[Fedora33](https://fedoramagazine.org/announcing-fedora-33/)。

另外一件事我想现在就说明的是：我没有使用任何GUI工具操作Docker。

尽管不同平台有一些很好用的GUI工具，但是学习基本命令行Docker命令是本书的主要目标之一。

---

<h2 id="4">4. Docker运行Hello World - Docker基本介绍</h2>

现在在你的机器上有一个运行中的Docker，是时候运行你的第一个容器了，打开命令行，输入如下命令：

```shell
docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:9ade9cc2e26189a19c2e8854b9c8f1e14829b51c55a630ee675a5a9540ef6ccf
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

[hello-world](https://hub.docker.com/_/hello-world)镜像是Docker提供的一个很小的容器化程序，它是很简单的[hello.c](https://github.com/docker-library/hello-world/blob/master/hello.c)程序，在终端打印出Hello World字符串。

在终端中，你可以执行使用`docker ps -a`命令来查看目前或者历史运行的Docker容器

```
docker ps -a

# CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
# 128ec8ceab71        hello-world         "/hello"            14 seconds ago      Exited (0) 13 seconds ago                      exciting_chebyshev
```

输出结果中，镜像hello-world对应有一个命名为`exciting_chebyshev`的容器，容器的ID为`128ec8ceab71`，还有一个`Exited（0）13 seconds ago`的状态表示容器运行的过程中没有产生错误。

为了能够理解刚才屏幕中输出的内容，必须要了解Docker的架构和容器化技术的三个基本概念，如下：

- [容器](https://www.freecodecamp.org/news/@fhsinchy/s/the-docker-handbook/~/drafts/-MS1b3opwENd_9qH1jTO/hello-world-in-docker#container)
- [镜像](https://www.freecodecamp.org/news/@fhsinchy/s/the-docker-handbook/~/drafts/-MS1b3opwENd_9qH1jTO/hello-world-in-docker#image)
- [仓库](https://www.freecodecamp.org/news/@fhsinchy/s/the-docker-handbook/~/drafts/-MS1b3opwENd_9qH1jTO/hello-world-in-docker#registry)

我按照字母表的顺序开始第一个重要概念的讲解：

<h3 id="4.1">4.1 什么是容器？</h3>

在容器化技术中，没有比容器更基本的概念了。

[Docker官方文档](https://www.docker.com/resources/what-container)中是这样说的：

> 容器是可以将应用和其依赖打包在一起的应用层的一种抽象。与虚拟化整个硬件不同，容器仅仅将宿主操作系统虚拟化。

你可以认为容器化技术是下一代的虚拟化技术。

就像虚拟机一样，容器之间以及容器和宿主机之间环境都是彼此隔离的。相比较虚拟机，容器也更加轻量级，因此同一个宿主机上可以同时跑多个容器，并且不影响宿主机的性能。

容器和虚拟机使用不同的方法进行虚拟化，两者的主要不同是虚拟化方法的不同。

虚拟机通常被一个叫做Hypervisor的程序创建并管理，例如[Oracle VM VirtualBox](https://www.virtualbox.org/)、[VMware](https://www.vmware.com/)、[KVM](https://www.linux-kvm.org/)和微软[Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)等等。这个Hypervisor程序处在宿主机操作系统和虚拟机之间，承担中间通信的职责。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-07.png)

在虚拟机中运行的程序和本地操作系统（gust operating system）通信，本地操作系统和Hypervisor程序通信，Hypervisor程序再向宿主机操作系统从硬件中申请必要的资源来运行程序。

从上面可以看出，虚拟机中运行的程序和宿主基础硬件之间有一个长长的通信链，即使是虚拟机中程序申请很小的资源，由于本地操作系统的存在也增加了明显的性能消耗。

和虚拟机使用的虚拟方法不一样，容器使用更加聪明的方式。容器没有完整的本地操作系统，它通过运行时的容器服务使用宿主机操作系统，同时又像虚拟机那样保持环境的隔离性。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-08.png)

运行时的容器服务，也就是Docker，处在宿主机操作系统和容器之间，容器通过Docker和宿主机操作系统进行通信，从基础物理硬件获取程序运行的资源。

容器由于取消了完整的本地操作系统，相比虚拟机更加轻量级和资源少消耗。

为了验证这一点，执行下面的代码：

```
uname -a
# Linux DESKTOP-N5K2GI1 5.10.16.3-microsoft-standard-WSL2 #1 SMP Fri Apr 2 22:23:49 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux

docker run alpine uname -a
# Linux 9c2c71a183ee 5.10.16.3-microsoft-standard-WSL2 #1 SMP Fri Apr 2 22:23:49 UTC 2021 x86_64 Linux
```

上面的代码中，我先在宿主机上执行了`uname -a`命令，获取宿主机操作系统的内核详情。然后第二行运行了一个[Alpine Linux](https://alpinelinux.org/)容器执行了同样的命令。

从输出的结果可以看出来，容器实际上使用了宿主机操作系统的内核，这也证明了容器虚拟化了宿主机的操作系统而不是自身也拥有一个。

如果你使用Windows机器，你会发现所有的容器都是使用WSL2内核，这是因为WSL2提供Windows上Docker的后台服务。在macOS系统上，默认的后台服务是一个基于[HiperKit](https://github.com/moby/hyperkit) Hypervisor的VM。

> 冯兄话吉：冯兄(译者)的操作环境正是WSL2。

<h3 id="4.2">4.2 什么是镜像？</h3>

镜像是分层的，自包含的，用来创建容器的模版源文件。它们可以通过镜像仓库共享。

过去，不同的容器引擎需要不同的镜像格式。后来，[Open Container Initiative（OCI）](https://opencontainers.org/)定义了标准的容器镜像规范，大部分的主流容器化平台都遵循这一规范，这也意味着在Docker上构建的镜像在没有任何修改的情况下可以直接在Podman容器平台上使用。

容器其实就是运行时的镜像，当你从互联网上获取一个镜像并且运行这个镜像的时候，你实际上基于只读镜像层新创建了一个临时可写入层。

镜像的概念会随着本书的深入会越来越清晰，现在需要记住的是，镜像是一个多层次的、只读的，将你的应用打包为指定某一状态的文件。

<h3 id="4.3">4.3 什么是Docker仓库（Docker Registry）？</h3>

我们已经学习了两个非常重要的概念，容器和镜像，剩下的就是Docker仓库的概念了。

镜像仓库是一个你能够上传并且下载别人上传镜像的中央镜像管理处。[Docker Hub](https://hub.docker.com/)是Docker官方默认的镜像仓库，另外一个流行的镜像仓库是Red Hat的[Quay](https://quay.io/)。

本书中，我们使用Docker Hub作为我们的镜像仓库。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-11.jpg)

你可以免费在Docker Hub上分享你的公开镜像，互联网上的人们可以从那里免费下载它们。我上传的镜像可以在我的主页（[fhsinchy](https://hub.docker.com/u/fhsinchy)）中找到。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-12.jpg)

除了Docker Hub和Quay，你也可以创建私有的镜像仓库。实际你本地也运行着一个私有仓库，用来存储从远端仓库拉下来的镜像。

<h3 id="4.4">4.4 Docker架构</h3>

现在你已经学习了容器化技术和Docker的基本概念，是时候学习Docker是怎么工作的。

Docker引擎包含三个主要部分：

1. **Docker Daemon**：daemon进程（`dockerd`）在后台运行并且监听客户端的请求，它能够管理各种各样的Docker对像。
2. **Docker Client**：客户端（`docker`）是一个命令行接口程序，主要负责传递用户的请求。
3. **REST API**：REST接口是Docker后台程序和客户端之间的桥梁，用户输入的任务命令行请求都会通过接口传递到后台Docker Daemon那里。

根据官方[文档](https://docs.docker.com/get-started/overview/#docker-architecture)：

> Docker使用C/S的架构，客户端向服务端通信，服务端处理构建、运行和分发容器的工作。

你作为用户使用Docker客户端输入命令，客户端使用REST API将命令转发给后台守护进程dockerd，并由后台进程完成工作。

<h3 id="4.5">4.5 完整的Docker工作过程</h3>

好的，基础的概念已经了解了，我们开始把所学习的一切串起来，看看它们合在一起是怎么工作的。在我们详细讲解`docker run hello-world`命令背后到底发生什么之前，先看看我画的一张图：

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-12.png)

这张图基于Docker官方网站的一张稍微作出改动，当你执行命令的时候，发生的事情如下：

1. 你执行`docker run hello-world`命令，这里的hello-world是Docker镜像的名字。
2. Docker客户端转发命令到Docker后台进程，说要获取hello-world镜像并创建一个容器。
3. Docker后台进程从本地仓库中寻找镜像，但是没有找到，日记中会打印出：`Unable to find image 'hello-world':latest`。
4. Docker后台进程会去默认的Docker Hub仓库中下载最新的镜像，日志中会打印出：`latest: pulling from library/hello-world`。
5. Docker后台进程基于下载的镜像创建一个容器。
6. 最后，Docker后台进程运行这个容器，并输出结果到命令行终端上。

Docker在本地找不到拉取镜像的时候，默认会去Docker Hub仓库下载。一旦镜像被下载，就会缓存到本地仓库。所以，你重新执行命令，就看不到如下的日志输出：

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:9ade9cc2e26189a19c2e8854b9c8f1e14829b51c55a630ee675a5a9540ef6ccf
Status: Downloaded newer image for hello-world:latest
```

如果在公共的Docker仓库有一个新的镜像版本，Docker后台程序会重新获取镜像，这里的`:latest`是一个标签。Docker镜像会有一个有意义标签表示版本或者构建。关于标签我们在后续会做详细介绍。

---

<h2 id="5">5. Docker容器基本操作</h2>

在前面的章节中，你学习了Docker的基础概念并且使用docker run命令运行了一个Docker容器。

在这一部分中，你们将会学习到详细的Docker容器操作。容器操作是你每天必须执行的基本任务，所以正确的理解各种命令很关键。

要知道的是，这里列出来的Docker命令不是全部的，而是一些最基本的命令。如果想要学习更多Docker支持的命令，可以访问官方文档的[命令行说明](https://docs.docker.com/engine/reference/commandline/container/)。

<h3 id="5.1">5.1 怎样运行一个容器？</h3>

之前的章节我们基于hello-world镜像，使用docker run命令启动了一个容器。基本的命令行语法是这样的：

```shell
docker run <image-name>
```

尽管这是一个很有效命令，Docker提供了更好的方式，可以将客户端命令传递给Docker后台进程。

在Docker1.13之前，Docker只支持上面语法的命令。后来，Docker[重构](https://www.docker.com/blog/whats-new-in-docker-1-13/)了命令行语法：

```shell
docker <object> <command> <options>
```

在这个语法中：

- object表示你要操作的Docker对象，可以是container、image、network和volume对象。
- command表示Docker后台进程要执行的内容，比如说run。
- options可以是任何有效的覆盖默认行为的参数，例如`--publish`参数表示端口映射。

参照上面的语法，run命令可以写成：

```shell
docker container run <image-name>
```

image name可以是任何本地或者远程仓库上的镜像名称。例如，你也可以使用[fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock)这个镜像名称，这个镜像包含了一个简单的[vue.js](https://vuejs.org/)应用，运行容器内应用启动并监听80端口。想要运行这个镜像的容器，执行下面的命令：

```
docker container run --publish 8080:80 fhsinchy/hello-dock

Unable to find image 'fhsinchy/hello-dock:latest' locally
latest: Pulling from fhsinchy/hello-dock
0a6724ff3fcd: Pull complete
1d7c87af3754: Pull complete
9668ffa91d19: Pull complete
e81a2f5037c1: Pull complete
991b5ddb4d9e: Pull complete
9f4fab0aaa1b: Pull complete
Digest: sha256:852a90695e942a8aefe5883cb9681a3fbedfdf89f64468e22fa30e04766e5f2e
Status: Downloaded newer image for fhsinchy/hello-dock:latest
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
```

命令行很好理解，需要解释的`--publish 8080:80`参数会在下一部分内容中解释。

<h3 id="5.2">5.2 怎样发布一个端口？</h3>

容器是隔离的环境。容器的宿主机并不知道容器内发生的一切。因此，容器外部是不能直接访问容器内部的。

如果想要容器外部访问容器，需要将容器内部的端口发布到容器宿主机的网路上，语法`--publish`和`-p`如下：

```shell
--publish <host port>:<container port>
```

当你像刚才命令中那样指定`--publish 8080:80`参数，意味着任何访问宿主机8080端口的请求都会被转发到容器内到80端口。

现在可以在浏览器中访问http://127.0.0.1:8080。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-15.jpg)

> 冯兄话吉：这里127.0.0.1代表启动docker服务的宿主机IP，如果你在宿主机上启动的虚拟机或者WSL，需要替换为VM的IP。后续文章中给出的`http://127.0.0.1`访问页面都要注意IP地址替换的问题。

你可以使用ctrl + c命令停止容器，命令行终端将会停止进程或者关闭整个终端。

<h3 id="5.3">5.3 怎样使用后台模式？</h3>

另外一个`run`命令常用的命令行参数是`--detach`或者`-d`。在上面的操作中，容器如果想保持运行状态，必须要保持命令行窗口打开的状态。关闭命令行窗口，容器就会被停掉。

这是因为，默认容器在前台启动，并且会像其他程序一样绑定在调用方终端上。

我们可以通过`--detach`参数让容器在后台启动，命令如下：

```shell
docker container run --detach --publish 8080:80 fhsinchy/hello-dock

# 9f21cb77705810797c4b847dbd330d9c732ffddba14fb435470567a7a3f46cdc
```

和之前不一样，你的命令行终端上打印出了容器的ID。

参数的顺序先后没有关系，如果你把`--publish`参数放在了`--detach`参数之前，容器依然可以正常启动。对于`docker run`命令，只要记住镜像的名字是放在最后的就可以，如果镜像的名字后面还有内容，会被作为容器entry-point（见[在一个容器中执行命令](https://fengmengzhao.github.io/2021/06/25/docker-handbook-2021.html#executing-commands-inside-a-container)模块）的参数传递，可能会得到意想不到的结果。

<h3 id="5.4">5.4 怎样查看容器？</h3>

`container ls`命令可以展示出正在运行中的容器，命令如下：

```
docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   5 seconds ago       Up 5 seconds        0.0.0.0:8080->80/tcp   gifted_sammet
```

一个名称为`gifted_sammet`的容器在运行中，它在5秒钟之前被创建，并且已经正常启动了5秒钟。

容器的ID是`9f21cb777058`，这个ID是完整容器ID的前12个字符，完整的ID是`9f21cb77705810797c4b847dbd330d9c732ffddba14fb435470567a7a3f46cdc`，含有64个字符。当前面使用`docker container run`运行容器的时候，完整的容器ID就输出在了控制台。

`port`列表示宿主机8080端口指向容器的80端口。`gifted_sammet`名字是docker生成的，根据平台不同，这个名字可能也不同。

`container ls`命令仅仅展示出了目前正在运行的容器，如果想列出来历史运行过的容器，使用`--all`或者`-a`参数。

```
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                     PORTS                  NAMES
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   2 minutes ago       Up 2 minutes               0.0.0.0:8080->80/tcp   gifted_sammet
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   3 minutes ago       Exited (0) 3 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 4 minutes ago       Exited (0) 4 minutes ago                          exciting_chebyshev
```

可以看出来，第二个名字为`reverent_torvalds`的容器早些时候运行过，退出时候exit code为0，标识容器运行的时候没有产生错误。

<h3 id="5.5">5.5 怎样命名或者重命名一个容器？</h3>

每一个容器默认都有两个标识，它们是：

- 容器ID - 64位长度的字符串。
- 容器名称 - 用下划线连接的两个随机单词。

使用随机生成的容器名称来指代容器很不方便，我们也可以自定义容器的名称。

通过参数`--name`可以定义容器名称，基于镜像`fhsinchy/hello-dock`启动另外一个名称为`hello-dock-container`的容器，使用如下命令：

```
docker container run --detach --publish 8888:80 --name hello-dock-container fhsinchy/hello-dock

# b1db06e400c4c5e81a93a64d30acc1bf821bed63af36cab5cdb95d25e114f5fb
```

8080的本地端口被我们之前启动的容器占用着，因此我们使用了一个新的端口8888。可以查看下启动的容器：

```
docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   28 seconds ago      Up 26 seconds       0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   4 minutes ago       Up 4 minutes        0.0.0.0:8080->80/tcp   gifted_sammet
```

名称为`hello-dock-container`的容器处于运行中状态。

你也可以使用`docker container rename`命令重命名一个容器，语法如下：

```shell
docker container rename <container identifier> <new name>
```

重命名之前的名称为gifted_sammet的容器为hello-dock-container-2，命令如下：

```shell
docker container rename gifted_sammet hello-dock-container-2
```

这个命令执行没有任何输出结果，不过你可以通过查看容器列表`container ls`确实是否修改成功

无论容器在运行态或者停止态，`rename`命令都可以使用。

<h3 id="5.6">5.6 怎样停止或者杀死一个运行中的容器？</h3>

前台运行的容器可以通过关闭终端命令行或者按键ctrl + c来停止运行。后台运行的容器需要使用不同的方法。

有两个命令可以停止容器，第一个是`container stop`命令，基本的语法是：

```shell
docker container stop <container identifier>
```

这里的container identifier可以是容器的名称或者ID。

应该还记得我们之前启动的容器还在后台运行着，通过container ls查看容器的标识（这里我们以hello-dock-container作为示例）。执行下面的命令来停止容器运行：

```
docker container stop hello-dock-container

# hello-dock-container
```

如果你使用容器的名称作为标识，容器停止后控制台会将名字输出。stop命令通过发送`SIGTERM`信号优雅的关闭掉了容器。如果容器在一段时间内没有停掉，则会发送一个`SIGKILL`信号，立即停止容器。

如果你想发送`SIGKILL`而不是`SIGTERM`信号，你可以使用container kill命令，命令的语法如下：

```
docker container kill hello-dock-container-2

# hello-dock-container-2
```

<h3 id="5.7">5.7 怎样重启一个容器？</h3>

这里说的重启，有两种场景：

- 重启之前已经停掉或者被杀死的容器
- 重启一个运行中的容器

在上面的章节中，我们系统中有停掉的容器，可以使用`container start`命令来启动停掉或者被杀死的容器，语法如下：

```shell
docker container start <container identifier>
```

可以使用`container ls --all`命令列出来所有的容器，找到状态是`Exited`的。

```
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                        PORTS               NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   3 minutes ago       Exited (0) 47 seconds ago                         hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   7 minutes ago       Exited (137) 17 seconds ago                       hello-dock-container-2
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   7 minutes ago       Exited (0) 7 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 9 minutes ago       Exited (0) 9 minutes ago                          exciting_chebyshev
```

现在可以重启`hello-dock-container`容器，执行以下命令：

```
docker container start hello-dock-container

# hello-dock-container
```

可以通过`container ls`命令展示运行中的容器，验证容器是否启动成功。

`container start`命令默认情况下，保留之前的端口配置启动任何后台容器，所以如果你现在访问`http://127.0.0.1:8080`，就能够像之前那样访问到`hello-dock`应用。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-15.jpg)

现在说下重启运行中容器的场景，要用到`container restart`命令，语法和`container start`命令类似。

```
docker container restart hello-dock-container-2

# hello-dock-container-2
```

二者不同的地方在于，重启容器（restart）是先停掉容器再启动，而启动（start）容器就直接启动。

对于停止状态的容器，二者都可以使用。但是对于运行中的容器，只能使用`docker restart`命令。

<h3 id="5.8">5.8 怎样不启动容器的情况下创建一个容器？</h3>

目前，我们学习用`docker run`命令启动一个容器。实际上，这个命令包含两部分：

- `container create`命令，基于一个镜像创建一个容器。
- `container start`命令，启动刚刚创建的容器。

我们可以像[怎样运行一个容器](#7.1)章节那样，分两个步骤，启动一个容器：

```
docker container create --publish 8080:80 fhsinchy/hello-dock

# 2e7ef5098bab92f4536eb9a372d9b99ed852a9a816c341127399f51a6d053856

docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS               NAMES
# 2e7ef5098bab        fhsinchy/hello-dock   "/docker-entrypoint.…"   30 seconds ago      Created                                 hello-dock
```

通过上面`container ls --all`命令展示所有容器，我们看到一个基于镜像`fhsinchy/hello-dock`的名称是`hello-dock`的容器。目前容器的状态是`Created`，说明这个容器没有运行，使用参数`--all`容器也不会展示出来。

容器创建后，我们可以用`container start`命令来启动它：

```
docker container start hello-dock

# hello-dock

docker container ls

# CONTAINER ID        IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 2e7ef5098bab        fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up 29 seconds       0.0.0.0:8080->80/tcp   hello-dock
```

容器的状态从`Created`变为了`Up 29 seconds`，表明容器现在是运行的状态。之前空着的PORTS列也有了数据。

<h3 id="5.9">5.9 怎样移除一个不用的容器？</h3>

一个被停掉或者杀死的容器还会停留在系统中，这些不用的容器会占用空间并且可能会很新的容器冲突。

可以是`container rm`移除停掉的容器，语法如下：

```shell
docker container rm <container-identifier>
```

想找出来哪些容器不是运行的状态，可以使用`container ls --all`命令并寻找`Exited`状态的容器。

```
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                      PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   6 minutes ago       Up About a minute           0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   10 minutes ago      Up About a minute           0.0.0.0:8080->80/tcp   hello-dock-container-2
# 6cf52771dde1        fhsinchy/hello-dock   "/docker-entrypoint.…"   10 minutes ago      Exited (0) 10 minutes ago                          reverent_torvalds
# 128ec8ceab71        hello-world           "/hello"                 12 minutes ago      Exited (0) 12 minutes ago                          exciting_chebyshev
```

从上面我们能找出来，容器ID是`6cf52771dde1`和`128ec8ceab71`的容器不是运行的状态，移除容器ID`6cf52771dde1`的容器，执行命令：

```
docker container rm 6cf52771dde1

# 6cf52771dde1
```

可以使用`container ls --all`来验证容器是否被移除。如果要批量移除容器，可以一次性将容器的标识用空格隔开传递给命令。

或者，你可以不用单个的移除容器，使用`container prune`命令可以一次性移除所有停掉或者退出的容器。

使用`container ls --all`命令验证容器是否被移除：

```
docker container ls --all

# CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                  NAMES
# b1db06e400c4        fhsinchy/hello-dock   "/docker-entrypoint.…"   8 minutes ago       Up 3 minutes        0.0.0.0:8888->80/tcp   hello-dock-container
# 9f21cb777058        fhsinchy/hello-dock   "/docker-entrypoint.…"   12 minutes ago      Up 3 minutes        0.0.0.0:8080->80/tcp   hello-dock-container-2
```

如果严格按照本书的执行，执行到了这里，应该能够看到列表中的另个容器：`hello-dock-container`和`hello-dock-container-2`。建议进行下面的内容之前将这两个容器移除。

`container run`命令和`container start`命令也有一个参数`--rm`，表示一旦容器停掉就删除容器。可以使用`--rm`参数启动另一个`hello-dock`容器。

```
docker container run --rm --detach --publish 8888:80 --name hello-dock-volatile fhsinchy/hello-dock

# 0d74e14091dc6262732bee226d95702c21894678efb4043663f7911c53fb79f3
```

使用`container ls`命令查看容器是否启动：

```shell
docker container ls

# CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                  NAMES
# 0d74e14091dc   fhsinchy/hello-dock   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8888->80/tcp   hello-dock-volatile

```

现在可以停掉这个容器并使用`container ls --all`名称查看确认：

```shell
docker container stop hello-dock-volatile

# hello-dock-volatile

docker container ls --all

# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

可以看见容器被自动删除了。后面我们基本上都会用上`--rm`参数，不需要的地方会特殊说明。

<h3 id="5.10">5.10 怎样使用命令行交互的方式启动一个容器？</h3>

目前我们基于[hello-world](https://hub.docker.com/_/hello-world)和[fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock)镜像创建并运行容器，这些都是简单程序的镜像，不需要命令行交互。

镜像不都是这么简单的，它可以封装进去整个Linux的发行版。

流行的Linux发型版，例如[Ubuntu](https://ubuntu.com/)、[Fedora](https://fedora.org/)和[Debian](https://debian.org/)在官方的仓库中都有Docker镜像。编程语言，像[python](https://hub.docker.com/_/python)、[php](https://hub.docker.com/_/php)、[go](https://hub.docker.com/_/golang)，或者运行时环境[node](https://hub.docker.com/_/node)和[deno](https://hub.docker.com/r/hayd/deno)都有自己的官方镜像。

这些镜像不仅仅是做了提前的一些配置，还默认会配置执行一个shell。对于操作系统镜像来说，可能是一个`sh`或者`bash`，对于一个编程语言或者运行时环境，可能是语言自身的shell。

我们都知道，shell是命令行交互式程序。如果一个镜像配置执行这样一个程序，这样的镜像称之为交互式的镜像。他们在启动容器`docker run`的时候需要一个`-it`参数。

举一个例子，如果你使用`docker container run ubuntu`启动一个ubuntu镜像的容器，命令行上你会看不到任何输出。但是如果你加上`-it`参数，你就能够直接在命令行中操作这个Ubuntu容器。

```shell
docker container run --rm -it ubuntu

root@573b5a48e7a8:/# cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.3 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.3 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal
root@573b5a48e7a8:/#
```

上面，我们执行命令`cat /etc/os-release`得到相应的输出，说明我们确实是和Ubuntu容器在进行交互。

`-it`参数能够让你和容器内的交互式程序进行交互。这个参数实际上是有两部分组成在一起。

- `-i`参数或者`--interactive`绑定连接终端到容器的输入流中，因此你可以在终端中输入。
- `-t`或者`--tty`参数保证输出的内容格式化，并且通过分配一个伪tty让你有一个很好的终端体验。

当你像以命令行交互的方式运行一个容器的时候，你需要使用`-it`。你可以这样启动node容器：

```shell
docker container run -it node

# Welcome to Node.js v15.0.0.
# Type ".help" for more information.
# > ['farhan', 'hasin', 'chowdhury'].map(name => name.toUpperCase())
# [ 'FARHAN', 'HASIN', 'CHOWDHURY' ]
```

任何有效的JavaScript代码都可以在这个终端中运行。`-it`是缩写，我们也分别可以写成`--interactive --tty`。

<h3 id="5.11">5.11 怎样在容器内执行命令？</h3>

在[Docker运行Hello World - Docker基本介绍](#4)章节，我们运行了一个Alpine Linux容器，并且执行了一个命令：

```
docker run alpine uname -a
# Linux 9c2c71a183ee 5.10.16.3-microsoft-standard-WSL2 #1 SMP Fri Apr 2 22:23:49 UTC 2021 x86_64 Linux
```

在上面的命令中，我在容器Alpine Linux容器中执行了`uname -a`命令。像这种的场景（启动一个容器的时候，需要在容器内执行一个命令）很常见。

假设你想base64一个字符串，这在Linux或者Unix系统中很容易做到（不包括Windows系统）。

你可以快速的启动一个基于[busybox](https://hub.docker.com/_/busybox)的镜像的容器，让这个容器做base64的工作。

把一个字符串base64的基本语法是：

```
echo -n my-secret | base64

# bXktc2VjcmV0
```

将命令传递给没有在运行的容器的基本语法是：

```shell
docker container run <image name> <command>
```

使用`busybox`镜像运行容器，并让容器执行base64命令，可以这样启动：

```
docker container run --rm busybox echo -n my-secret | base64

# bXktc2VjcmV0
```

这里的处理逻辑上，`docker run`命令任何在image name后面的内容都作为参数传递给容器的默认`entry point`。

所谓的`entry point`就是一个镜像的入口。除了可执行镜像（在下面[怎样操作可执行镜像](#5.12)章节说明）外，大部分镜像使用`shell`或者`sh`作为默认的`entry point`。因此任何有效的shell命令都可以作为参数传递。

<h3 id="5.12">5.12 怎样操作可执行镜像？</h3>

之前我们有简单提到可执行容器，这些容器的目的是像程序一样可执行。

看一看我的[rmbyext](https://github.com/fhsinchy/rmbyext)项目，这是一个简单的Python脚本，能够递归删除给定扩展名的文件。可以访问仓库了解更详细的信息：

[![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-27.jpg)](https://github.com/fhsinchy/rmbyext)

如果你已经安装了Git和Python，可以执行下面的命令安装这个脚本：

```shell
pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext
```

如果你已经配置好了Python环境命令，在任意的命令行中，都可以使用以下命令：

```shell
rmbyext <file extension>
```

为了测试，在一个空目录中打开命令行并以不同的扩展创建多个文件。你可以使用touch命令来这样做，现在我们有了一个目录，目录中有如下文件：

```
touch a.pdf b.pdf c.txt d.pdf e.txt

ls

# a.pdf  b.pdf  c.txt  d.pdf  e.txt
```

要删除所有的pdf文件，可以执行如下的命令：

`rmbyext pdf`

> 冯兄话吉：如果你不想安装`pip`，只要有Python环境就可以了。克隆项目`git clone https://github.com/fhsinchy/rmbyext.git`，找到对应的`rmbyext.py`用Python执行即可。在冯兄译者的操作环境中先进入测试文件目录，执行：`sudo python3 ../rmbyext.py pdf`。

一个可执行的镜像也应该像`rmbyext`脚本文件一样，接收一个文件后缀的参数，能够删除后缀结尾的文件。

[fhsinchy/rmbyext](https://hub.docker.com/r/fhsinchy/rmbyext)镜像和上面的程序类似，它包含了`rmbyext`脚本，并且配置了执行脚本时删除容器内`/zone`目录下的文件。

现在问题是容器和宿主机环境之间是隔离的，因此容器内运行的`rmbyext`程序不能够访问到宿主机的文件系统。如果我们能够将宿主机的目录映射到容器内的`/zone`目录，本地的文件就可以被宿主机访问到了。

使容器能够访问到宿主机文件系统的一种方法是绑定挂载点（bind mount）。

bind mount能够实现容器宿主机（源端）目录和容器（目标端）目录的内容保持一致，源端和目标端目录内和和的修改都会彼此同步。

我们来使用一下bind mount，不直接使用脚本删除文件，使用镜像来进行操作：

```shell
docker container run --rm -v $(pwd):/zone fhsinchy/rmbyext pdf

# Removing: PDF
# b.pdf
# a.pdf
# d.pdf
```

你可能已经猜到，我们在命令中使用了`-v $(pwd):/zone`参数。`-v`或者`--volume`参数用来为容器绑定一个挂载点，这个参数可以用冒号隔开的三部分组成，基本的语法是：

```shell
--volume <local file system directory absolute path>:<container file system directory path>:<read write access>
```

参数中前两部分是必选的，第三部分可选。

我们例子中的源端目录是`/home/fhsinchy/the-zone`，这个目录在命令行中是打开的，`$(pwd)`表示了之前提到的包含.pdf和.txt文件的当前工作目录。

你可以在[这里](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html)学习到更多的命令行替换的用法。

`-v`或者`--volume`参数对于`container run`命令是有效的，同样对于`container create`也是有效的。我们将在接下来的章节中详细研究volume这个概念，所以现在如果不太理解，不用太担心。

可执行的镜像和常规镜像不同的地方是，可执行镜像的入口是执行一个程序而不是shell。在`rmbyext`示例中，我们之前也说过，任何在镜像名称后面的内容都会作为参数传递给容器的入口。

因此最后我们的`docker container run --rm -v $(pwd):/zone fhsinchy/rmbyext pdf`命令将`rmbyext pdf`程序转化了可执行镜像在容器内运行。可执行镜像实际上并不常见，但是有时候会非常有用。

---

<h2 id="6">6. Docker镜像基本操作</h2>

目前为止，我么学会了怎样启动一个镜像。接下来学习怎样创建你自己的镜像。

这部分中，我们将会学习基本的创建一个镜像，运行这个镜像和在线分享镜像。

我建议你下载[Visual Studio Code](https://code.visualstudio.com/)的[Docker官方插件](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)，这样能极大有利于你的开发。

<h3 id="6.1">6.1 怎样创建一个Docker镜像？</h3>

在[hello-world章节](#4)我们有解释过，Docker镜像是多层次的、自包含的文件，是可以用来创建Docker容器的模版，就像是静态的容器的一份克隆。

在把你的程序创建成一个镜像之前，你必须要清楚定义这个镜像的版本。例如，基于[Nginx的官方镜像](https://hub.docker.com/_/nginx)，你可以通过如下命令启动容器：

```shell
docker container run --rm --detach --name default-nginx --publish 8080:80 nginx
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
07aded7c29c6: Pull complete
bbe0b7acc89c: Pull complete
44ac32b0bba8: Pull complete
91d6e3e593db: Pull complete
8700267f2376: Pull complete
4ce73aa6e9b0: Pull complete
Digest: sha256:06e4235e95299b1d6d595c5ef4c41a9b12641f6683136c18394b858967cd1506
Status: Downloaded newer image for nginx:latest
5451c55a1b74be3f97445b8254526cc0e01da65c923d6fa5da5f8ab9af1ce2ea

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 5451c55a1b74        nginx               "/docker-entrypoint.…"   8 seconds ago       Up 8 seconds        0.0.0.0:8080->80/tcp   default-nginx
```

现在，你可以在浏览器中访问`http://127.0.0.1:8080`，你会得到一个默认的响应界面。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-17.jpg)

这很好，但是如果你想自定义制作一个像官方那样的Nginx镜像呢？坦白来说，这种场景是会遇到的。我们来学习怎么制作它。

为了制作一个自定的Nginx镜像，必须要清楚镜像的最终状态是什么样的，在我看来应该是这样的：

- 镜像中的Nginx一定是安装好的，可以通过包管理命令行或者源代码编译的方式完成。
- 镜像启动的时候，Nginx应该自动启动。

很简单的，如果你克隆了书中链接的仓库，可以进入克隆的项目目录，找到一个`custom-nginx`的目录。

现在，在那个目录中创建一个名称为Dockerfile的文件，文件中定义的命令会执行怎样创建一个容器。Dockerfile的内容是：

```shell
FROM ubuntu:latest

EXPOSE 80

RUN apt-get update && \
    apt-get install nginx -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

镜像是多层的文件系统，在Dockerfile文件中，你写的每一行（称之为instructions）为镜像创建了一层。

- 每一个有效的Dockerfile都以`FROM`命令开头，该命令设定了你目标镜像的基础镜像。通过设置`ubuntu:latest`基础镜像，你可以在自定义的镜像中获取ubuntu系统的完美功能，你可以使用`apt-get`命令方便的进行包的安装。
- `EXPOSE`命令表示端口需要被发布。使用该指标后你仍然需要使用`--publish`命令发布端口，它仅仅起到了一个文档的作用来指示运行你镜像的人。它还有其他的作用，在这里就不讨论了。
- Dockerfile中的`RUN`命令在容器的shell中执行命令。`apt-get update && apt-get install nginx -y`命令首先更新包版本然后安装nginx。`apt-get clean && rm -rf /var/lib/apt/list/*`命令用来清理包缓存，因为你不需要在镜像中有不必要的垃圾。这两个命令在Ubuntu系统中是两个常见的操作，没什么特殊的。这里的`RUN`命令写成了`shell`的形式，它也可以写成`exec`的形式，你可以访问[官方的文档](https://docs.docker.com/engine/reference/builder/#run)获取更多的信息。
- 最后`CMD`命令设置镜像默认执行的命令。命令以`exec`的形式包含了三个部分。`nginx`表示可执行的nginx程序，`-g`和`daemon off`是nginx程序的可选参数表示让nginx以单进程的方式在容器内运行，`CMD`也可以用`shell`的形式来写，你可以[官方文档](https://docs.docker.com/engine/reference/builder/#cmd)获取更多信息。

现在，你有一个有效的Dockerfile可以用来创建镜像。和容器相关的命令一样，镜像相关的命令语法如下：

```shell
docker image <command> <options>
```

想要创建你刚刚写的Dockerfile的镜像，在`custom-nginx`目录中打开终端，执行如下命令：

```shell
docker image build .

# Sending build context to Docker daemon  3.584kB
# Step 1/4 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/4 : EXPOSE 80
#  ---> Running in 9eae86582ec7
# Removing intermediate container 9eae86582ec7
#  ---> 8235bd799a56
# Step 3/4 : RUN apt-get update &&     apt-get install nginx -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in a44725cbb3fa
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container a44725cbb3fa
#  ---> 3066bd20292d
# Step 4/4 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 4792e4691660
# Removing intermediate container 4792e4691660
#  ---> 3199372aa3fc
# Successfully built 3199372aa3fc
```

为了执行镜像的构建，后台进程需要知道特定的信息，比如Dockerfile的名称和执行的上下文，命令的含义是：

- `docker image build`是构建镜像的命令，后台进程会在上下中寻找名称为Dockerfile的文件。
- 命令末尾的`.`设置build的上下文，也就是后台进程在构建过程中能访问的目录。

现在，你可以运行你刚刚构建的镜像。你可以使用`container run`命令和刚才构建镜像时得到的构建进程返回的镜像ID一起使用。我执行返回的ID是`3199372aa3fc`，表示镜像成功构建。

```shell
docker container run --rm --detach --name custom-nginx-packaged --publish 8080:80 3199372aa3fc

# ec09d4e1f70c903c3b954c8d7958421cdd1ae3d079b57f929e44131fbf8069a0

docker container ls

# CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
# ec09d4e1f70c        3199372aa3fc        "nginx -g 'daemon of…"   23 seconds ago      Up 22 seconds       0.0.0.0:8080->80/tcp   custom-nginx-packaged
```

> 冯兄话吉：上面命令中最后的镜像ID要改为你刚刚构建的镜像ID。

你可以访问`http://127.0.0.1:8000`验证容器是否启动成功。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-17.jpg)

<h3 id="6.2">6.2 怎样给镜像打标签？</h3>

和容器一样，你可以不使用随机生成的ID而给镜像设置自定义的标识。对于一个镜像来说，这叫做打标签而不是重命名。`--tag`或者`-t`参数可以用来打标签。

通用的语法如下：

```shell
--tag <image repository>:<image tag>
```

repository是镜像的名称，image tag表示一个特定的构建或者版本。

拿[官方镜像mysql](https://hub.docker.com/_/mysql)为例，如果你想让运行特定版本，例如5.7的mysql容器，你可以执行`docker container run mysql:5.7`，这里`mysql`就是镜像名称，`5.7`是对应的标签。

如果你想定义custom-nginx:packaged这样自定义的标签，你可以在执行构建命令的时候这样：

```shell
docker image build --tag custom-nginx:packaged .

Sending build context to Docker daemon  1.052MB
Step 1/4 : FROM ubuntu:latest
 ---> 597ce1600cf4
Step 2/4 : EXPOSE 80
 ---> Using cache
 ---> 5c8cabcce264
Step 3/4 : RUN apt-get update &&     apt-get install nginx -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
 ---> Using cache
 ---> 46f355762489
Step 4/4 : CMD ["nginx", "-g", "daemon off;"]
 ---> Using cache
 ---> e1b5f20aceb8
Successfully built e1b5f20aceb8
Successfully tagged custom-nginx:packaged
```

现在你可以使用custom-nginx标识代替随机的串来引用你的镜像。

如果你在构建的时候忘记给镜像打标签，可以使用`image tag`命令重打标签：

```shell
docker image tag <image id> <image repository>:<image tag>
```

或者使用

```shell
docker image tag <image repository>:<image tag> <new image repository>:<new image tag>
```

<h3 id="6.3">6.3 怎样展示和删除镜像？</h3>

和`container ls`命令一样，你可以使用`image ls`命令展示出你本地的所有镜像：

```shell
docker image ls

# REPOSITORY     TAG        IMAGE ID       CREATED         SIZE
# <none>         <none>     3199372aa3fc   7 seconds ago   132MB
# custom-nginx   packaged   f8837621b99d   4 minutes ago   132MB
```

这里展示的镜像可以使用`image rm`命令删除，基本的语法如下：

```shell
docker image rm <image identifier>
```

这里镜像的标识可以镜像ID，也可以是镜像名称，如果是名称的话必须带上标签。例如要删除custom-nginx:package镜像，你可以执行如下命令：

```shell
docker image rm custom-nginx:packaged

Untagged: custom-nginx:packaged
Deleted: sha256:e1b5f20aceb8a56a683f23fc57d46d14d1e473a5c45ac57e05f6c55aa6282229
Deleted: sha256:46f355762489b70eb78ee04c46cdc20797343388320c90d2a2a61a381d740f27
Deleted: sha256:6be04f9858cd868a92ca44b1a51b42843b726c6093b8a4d88d9ae90631135841
Deleted: sha256:5c8cabcce264e95c534f7e906c62631b4f95d0c663fde83b67e0d838195629ae
```

你也可以使用`image prune`命令来清理所有未打标签的未使用的镜像。

```shell
docker image prune --force

# Deleted Images:
# deleted: sha256:ba9558bdf2beda81b9acc652ce4931a85f0fc7f69dbc91b4efc4561ef7378aff
# deleted: sha256:ad9cc3ff27f0d192f8fa5fadebf813537e02e6ad472f6536847c4de183c02c81
# deleted: sha256:f1e9b82068d43c1bb04ff3e4f0085b9f8903a12b27196df7f1145aa9296c85e7
# deleted: sha256:ec16024aa036172544908ec4e5f842627d04ef99ee9b8d9aaa26b9c2a4b52baa

# Total reclaimed space: 59.19MB
```

`--force`或者`-f`参数可以让你跳过是否确认的问题。你也可以使用`--all`或者`-a`命令删除本地所有缓存的镜像。

<h3 id="6.4">6.4 怎样理解多层镜像？</h3>

从这本书的一开始，我就说容器是一个多层的文件。在这一部分中，我将证明镜像的不同层和它们在镜像的构建中起到的重要作用。

我们将使用上一章节中的custom-nginx:packaged镜像来进行说明。

你可以使用`image history`命令来展示一个镜像的不同层次，custom-nginx镜像的不同层可以使用如下命令展示：

```shell
docker image history custom-nginx:packaged

# IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
# 7f16387f7307        5 minutes ago       /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B                             
# 587c805fe8df        5 minutes ago       /bin/sh -c apt-get update &&     apt-get ins…   60MB                
# 6fe4e51e35c1        6 minutes ago       /bin/sh -c #(nop)  EXPOSE 80                    0B                  
# d70eaf7277ea        17 hours ago        /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
# <missing>           17 hours ago        /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
# <missing>           17 hours ago        /bin/sh -c [ -z "$(apt-get indextargets)" ]     0B                  
# <missing>           17 hours ago        /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   811B                
# <missing>           17 hours ago        /bin/sh -c #(nop) ADD file:435d9776fdd3a1834…   72.9MB
```

这个镜像一共有8个层，最上面的是最新的层，越往下是越基础的层。最上面的层也就是你用来运行容器的层。

我们来进一步看看从镜像`d70eaf7277ea`到`7f16387f7307`，最后四个IMAG是`<missing>`的层我们忽略不看。

- `d70eaf7277ea`是由`/bin/sh -c #(nop)  CMD ["/bin/bash"]`创建的，表示Ubuntu系统默认的shell加载成功。
- `6fe4e51e35c1`是由`/bin/sh -c #(nop)  EXPOSE 80`创建的，代表Dockerfile中的第二行语句。
- `587c805fe8df`是由`/bin/sh -c apt-get update && apt-get install nginx -y && apt-get clean && rm -rf /var/lib/apt/lists/*`创建的，代表Dockerfile中的第三行语句。你也可以在镜像创建的执行中该镜像安装所有的包后有60M的大小。
- 最后最上层的镜像`7f16387f7307`是由`/bin/sh -c #(nop)  CMD ["nginx", "-g", "daemon off;"]`创建，设置该镜像默认执行的命令。

我们可以看到，镜像实际上是由很多只读层组成的，每一层记录着由特定的指令所触发的改变。当你运行一个镜像为容器时，实际上是基于最上层创建了一个可写入层。

这种分层模型的实现是由一个叫做联合文件系统(Union File System)的技术实现的，这里的联合指的是集合理论中的联合，根据[维基百科](https://en.wikipedia.org/wiki/UnionFS)：

> 它允许不同文件系统的文件或者目录，也称之为分支，覆盖重叠在一起形成统一的单个文件系统。相同目录的文件合并后会都出现新的虚拟文件系统合并分支的同一个目录中。

利用这个技术，Docker能够避免数据重复并且能够利用前一个创建的层作为cache构建下一个层。这样就会形成小巧的、有效的镜像，你可以在任何地方使用。

<h3 id="6.5">6.5 怎样从源代码构建NGINX？</h3>

在上一部分中，我们学习了`FROM,EXPOSE,RUN,CMD`等命令，接下来我们学习更多的命令。

这一部分中我们还是创建一个自定义的NGINX镜像，但是不是用`apt-get`包管理的方式进行安装，而是从源代码构建一个NGINX。

为了从源代码构建NGINX，你首先需要拿到NGINX的源代码。如果你克隆了我的项目，在custom-nginx目录中你就会找到nginx-1.19.2.tar.gz包，我们将使用这个nginx源代码包进行构建NGINX。

在写代码之前，我们首先理一下构建的过程。这次镜像的构建步骤有这些：

- 获取一个正确的基础镜像进行构建。例如[ubuntu](https://hub.docker.com/_/ubuntu)。
- 在基础镜像中安装必要的依赖。
- 将`nginx-1.19.2.tar.gz`包复制到基础镜像中。
- 解压源代码压缩包并删除压缩包。
- 配置构建参数，使用`make`命令编译并安装程序。
- 删除解压后的源代码。
- 运行可执行`nginx`。

这些步骤清楚之后，我们打开之前到Dockerfile，更新为：

```shell
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY nginx-1.19.2.tar.gz .

RUN tar -xvf nginx-1.19.2.tar.gz && rm nginx-1.19.2.tar.gz

RUN cd nginx-1.19.2 && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /nginx-1.19.2

CMD ["nginx", "-g", "daemon off;"]
```

你可以看到，Dockerfile中的命令就是我们上面写的几个步骤。

- `FROM`命令把Ubuntu作为构建任何应用的合适基础镜像。
- `RUN`命令安装源码构建NGINX依赖的基础包。
- `COPY`是一个新的命令。这个命令表示将nginx-1.19.2.tar.gz压缩包复制到镜像中。基本的语法是`COPY <source> <destination>`，这里的source是本地文件系统，destination是镜像。`.`表示复制的目的地，也就是镜像中的工作目录，如果没有特殊制定，默认该目录是根目录`/`。
- 第二个`run`命令从压缩包解压文件并且删除压缩包。
- 压缩包中是一个目录nginx-1.19.2包含着nginx源代码。因此下一步你需要`cd`到这个目录再执行构建的程序。你可以阅读[怎么在Linux系统基于源代码上安装并卸载软件](https://itsfoss.com/install-software-from-source-code/)这篇文章了解关于这个主题的更多内容。
- 一旦你构建并且安装成功，你可以使用`rm`命令删除nginx-1.19.2这个目录。
- 最后一步你像之前以一样用单进程的方式启动NGINX。

现在你可以使用下面的命令构建镜像：

```shell
docker image build --tag custom-nginx:built .

# Step 1/7 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/7 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in 2d0aa912ea47
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 2d0aa912ea47
#  ---> cbe1ced3da11
# Step 3/7 : COPY nginx-1.19.2.tar.gz .
#  ---> 7202902edf3f
# Step 4/7 : RUN tar -xvf nginx-1.19.2.tar.gz && rm nginx-1.19.2.tar.gz
 ---> Running in 4a4a95643020
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 4a4a95643020
#  ---> f9dec072d6d6
# Step 5/7 : RUN cd nginx-1.19.2 &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in b07ba12f921e
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container b07ba12f921e
#  ---> 5a877edafd8b
# Step 6/7 : RUN rm -rf /nginx-1.19.2
#  ---> Running in 947e1d9ba828
# Removing intermediate container 947e1d9ba828
#  ---> a7702dc7abb7
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 3110c7fdbd57
# Removing intermediate container 3110c7fdbd57
#  ---> eae55f7369d3
# Successfully built eae55f7369d3
# Successfully tagged custom-nginx:built
```

代码没有问题，但是我们有一些地方可以改进。

- 不要将文件名称写死为nginx-1.19.2.tar.gz，你可以用ARG命令创建一个参数，这样就可以通过改变参数来改变文件的名称或者版本。
- 不要手动下载源文件，你可以让后台进程下载文件。`ADD`命令能够做到从网络上加载资源到镜像中。

打开之前到Dockerfile并更新内容：

```shell
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}

RUN cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /${FILENAME}}

CMD ["nginx", "-g", "daemon off;"]
```

除了13、14行使用的`ARG`命令和16行使用的`ADD`命令外，新的的代码和之前的几乎一样。更新的内容如下：

- `ARG`命令让可以像其他语言一样声明一个变量，其他地方可以像使用`${argumentname}`这样使用。这里我把文件名nginx-1.19.2和文件扩展名tar.gz定义为两个变量，这样如果改变了nginx的版本或者改变了压缩方式就只有一个地方改变。代码中我给变量设置了默认值，变量的值可以通过`image build`命令的参数传递，你可以在[官方文档](https://docs.docker.com/engine/reference/builder/#arg)中了解更多。
- `ADD`命令中，我使用变量动态构建了一个URL。`https://nginx.org/download/${FILENAME}.${EXTENSION}`构建镜像的时候会替换为`https://nginx.org/download/nginx-1.19.2.tar.gz`这样。使用`ARG`命令只改变一个地方就可以改变文件的版本或者后缀名。
- `ADD`命令默认并不会解压网络中获取的资源，所以18行中使用了`tar`命令。

其余的代码几乎没有改变，现在你应该懂得了参数的使用。你可以使用更新后的代码重新构建镜像：

```shell
docker image build --tag custom-nginx:built .

# Step 1/9 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/9 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> cbe1ced3da11
### LONG INSTALLATION STUFF GOES HERE ###
# Step 3/9 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in 33b62a0e9ffb
# Removing intermediate container 33b62a0e9ffb
#  ---> fafc0aceb9c8
# Step 4/9 : ARG EXTENSION="tar.gz"
#  ---> Running in 5c32eeb1bb11
# Removing intermediate container 5c32eeb1bb11
#  ---> 36efdf6efacc
# Step 5/9 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> dba252f8d609
# Step 6/9 : RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}
#  ---> Running in 2f5b091b2125
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 2f5b091b2125
#  ---> 2c9a325d74f1
# Step 7/9 : RUN cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in 11cc82dd5186
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 11cc82dd5186
#  ---> 6c122e485ec8
# Step 8/9 : RUN rm -rf /${FILENAME}}
#  ---> Running in 04102366960b
# Removing intermediate container 04102366960b
#  ---> 6bfa35420a73
# Step 9/9 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 63ee44b571bb
# Removing intermediate container 63ee44b571bb
#  ---> 4ce79556db1b
# Successfully built 4ce79556db1b
# Successfully tagged custom-nginx:built
```

现在，你可以使用custom-nginx:build镜像来运行一个容器。

```shell
docker container run --rm --detach --name custom-nginx-built --publish 8080:80 custom-nginx:built

# 90ccdbc0b598dddc4199451b2f30a942249d85a8ed21da3c8d14612f17eed0aa

docker container ls

# CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                  NAMES
# 90ccdbc0b598        custom-nginx:built   "nginx -g 'daemon of…"   2 minutes ago       Up 2 minutes        0.0.0.0:8080->80/tcp   custom-nginx-built
```

新的容器运行起来了，通过`http://127.0.0.1:8080`应该能够访问这个容器。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-17.jpg)

这里NGINX默认返回了一个页面，你可以访问[官方文档](https://docs.docker.com/engine/reference/builder/)来学习更多的指令。

<h3 id="6.6">6.6 怎样优化一个Docker镜像？</h3>

我们上一部分中构建的镜像是能够运行的，但是不是最优的。我们可以通过`image ls`命令来看一看镜像的大小：

```shell
docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
# custom-nginx       built     1f3aaf40bb54   16 minutes ago   343MB
```

对于一个只包含NGINX的镜像太大了。如果你拉去官方的NGINX镜像查看大小，你会发现要小的多：

```shell
docker image pull nginx:stable

# stable: Pulling from library/nginx
# a076a628af6f: Pull complete 
# 45d7b5d3927d: Pull complete 
# 5e326fece82e: Pull complete 
# 30c386181b68: Pull complete 
# b15158e9ebbe: Pull complete 
# Digest: sha256:ebd0fd56eb30543a9195280eb81af2a9a8e6143496accd6a217c14b06acd1419
# Status: Downloaded newer image for nginx:stable
# docker.io/library/nginx:stable

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
# custom-nginx       built     1f3aaf40bb54   25 minutes ago   343MB
# nginx              stable    b9e1dc12387a   11 days ago      133MB
```

为了找到根本原因，我们首先看看Dockerfile：

```shell
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install build-essential\ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}

RUN cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install

RUN rm -rf /${FILENAME}}

CMD ["nginx", "-g", "daemon off;"]
```

第三行中我们看到`RUN`命令安装了很多东西，尽管这些东西对于构建NGINX是必要的，但是对于运行NGINX就不全是的了。

在我们安装的6个包中，仅仅有两个是运行NGINX必须的。它们是`libpcre3`和`zlib1g`。因此我们的想法是构建完成后卸载运行时不必要的包。

你可以更新Dockerfile为：

```shell
FROM ubuntu:latest

EXPOSE 80

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN apt-get update && \
    apt-get install build-essential \ 
                    libpcre3 \
                    libpcre3-dev \
                    zlib1g \
                    zlib1g-dev \
                    libssl1.1 \
                    libssl-dev \
                    -y && \
    tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} && \
    cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install && \
    cd / && rm -rfv /${FILENAME} && \
    apt-get remove build-essential \ 
                    libpcre3-dev \
                    zlib1g-dev \
                    libssl-dev \
                    -y && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
```

你可以看到，第10一整行做了所有必要的工作。实际的流程是这样的：

- 从第10到17行，所有必要的依赖包都安装了。
- 第18行，下载源代码包并解压后删除。
- 从第19行到28行，NGINX被配置、构建并安装在系统中。
- 第29行，从下载的压缩包中解压出来的文件被删除。
- 从第30行到36行，所有不必要的依赖包被卸载并清理的缓存。`libpcre3`和`zlib1g`包作为NGINX运行时依赖被保留。

你可能会问为什么在这一个`RUN`命令中要做这么多的操作，而不是像之前那样分为多个`RUN`命令，因为分开是错误的。

如果你安装包和删除包在分开的`RUN`命令中，它们将存在于镜像的不同层中。尽管最终的镜像也不会有删除的包，但是包含安装的镜像层也会反应到最终镜像的大小上。因此，要确保这些改变发生在同一个镜像层中。

我们重新构建优化后的Dockerfile。

```shell
docker image build --tag custom-nginx:built .

# Sending build context to Docker daemon  1.057MB
# Step 1/7 : FROM ubuntu:latest
#  ---> f63181f19b2f
# Step 2/7 : EXPOSE 80
#  ---> Running in 006f39b75964
# Removing intermediate container 006f39b75964
#  ---> 6943f7ef9376
# Step 3/7 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in ffaf89078594
# Removing intermediate container ffaf89078594
#  ---> 91b5cdb6dabe
# Step 4/7 : ARG EXTENSION="tar.gz"
#  ---> Running in d0f5188444b6
# Removing intermediate container d0f5188444b6
#  ---> 9626f941ccb2
# Step 5/7 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> a8e8dcca1be8
# Step 6/7 : RUN apt-get update &&     apt-get install build-essential                     libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} &&     cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install &&     cd / && rm -rfv /${FILENAME} &&     apt-get remove build-essential                     libpcre3-dev                     zlib1g-dev                     libssl-dev                     -y &&     apt-get autoremove -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> Running in e5675cad1260
### LONG INSTALLATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container e5675cad1260
#  ---> dc7e4161f975
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in b579e4600247
# Removing intermediate container b579e4600247
#  ---> 512aa6a95a93
# Successfully built 512aa6a95a93
# Successfully tagged custom-nginx:built

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED              SIZE
# custom-nginx       built     512aa6a95a93   About a minute ago   81.6MB
# nginx              stable    b9e1dc12387a   11 days ago          133MB
```

你可以看到镜像的大小从343MB下降到了81.6MB。官方的镜像大小为133MB。这已经是很大的优化了，我们在下一部分中会更进一步。

<h3 id="6.7">6.7 拥抱Alpine Linxu</h3>

如果你已经了解容器一段时间了，你应该遇到过叫做[Alpine Linux](https://alpinelinux.org/)的东西，它是一个类似于[Ubuntu](https://ubuntu.com/)、[Debian](https://ubuntu.com/)或者[Fedora](https://getfedora.org/)的[Linux发行版](https://en.wikipedia.org/wiki/Linux)。

Alpine的优点是基于`musl libc`和`busybox`并且非常轻量级。最新版本的[Ubuntu镜像](https://hub.docker.com/_/ubuntu)大小是28MB，而[alpine](https://hub.docker.com/_/ubuntu)只有2.8MB。

除了轻量级之外，Alpine也具有安全性并且相比较其他Linux发行版非常适合作为容器的基础镜像。

和其他商业发行版相比较Alpine使用上没有那个友好，但是（对于构建镜像来说）它的优势也非常明显。在这个章节中，我们学习使用Alpine基础镜像重新构建custom-nginx镜像。

更新Dockerfile如下：

```shell
FROM alpine:latest

EXPOSE 80

ARG FILENAME="nginx-1.19.2"
ARG EXTENSION="tar.gz"

ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .

RUN apk add --no-cache pcre zlib && \
    apk add --no-cache \
            --virtual .build-deps \
            build-base \ 
            pcre-dev \
            zlib-dev \
            openssl-dev && \
    tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} && \
    cd ${FILENAME} && \
    ./configure \
        --sbin-path=/usr/bin/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-pcre \
        --pid-path=/var/run/nginx.pid \
        --with-http_ssl_module && \
    make && make install && \
    cd / && rm -rfv /${FILENAME} && \
    apk del .build-deps

CMD ["nginx", "-g", "daemon off;"]
```

代码和之前的没有什么差异，有差异的地方列出来如下：

- 使用`apk add`而不是`apt-get install`命令安装依赖包。`--no-cache`参数表示下载的依赖包不会被缓存。同样使用了`apk del`而不是`apt-get remove`来卸载依赖包。
- `apk add`命令的`--virtual`参数表示将多个包捆扎成单个包便于管理。那些仅仅是构建时候依赖的包被打上`.build-deps`的标签，后续可以通过`apk del .build-deps`命令删除。你可以在官方文档中了解更多关于[virtuals](https://docs.alpinelinux.org/user-handbook/0.1a/Working/apk.html#_virtuals)参数的内容。
- 这里包的名称可能有些不同。一般每一个Linux发行版都有自己的包仓库开放给大家寻找包。如果你知道你任务要依赖的包，你可以直接到目的发行版的仓库中还搜索它。你可以在[这里](https://pkgs.alpinelinux.org/packages)寻找Alpine Linux的包。

现在使用新的Dockerfile构建镜像，看看镜像的大小：

```shell
docker image build --tag custom-nginx:built .

# Sending build context to Docker daemon  1.055MB
# Step 1/7 : FROM alpine:latest
#  ---> 7731472c3f2a
# Step 2/7 : EXPOSE 80
#  ---> Running in 8336cfaaa48d
# Removing intermediate container 8336cfaaa48d
#  ---> d448a9049d01
# Step 3/7 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in bb8b2eae9d74
# Removing intermediate container bb8b2eae9d74
#  ---> 87ca74f32fbe
# Step 4/7 : ARG EXTENSION="tar.gz"
#  ---> Running in aa09627fe48c
# Removing intermediate container aa09627fe48c
#  ---> 70cb557adb10
# Step 5/7 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> b9790ce0c4d6
# Step 6/7 : RUN apk add --no-cache pcre zlib &&     apk add --no-cache             --virtual .build-deps             build-base             pcre-dev             zlib-dev             openssl-dev &&     tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION} &&     cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install &&     cd / && rm -rfv /${FILENAME} &&     apk del .build-deps
#  ---> Running in 0b301f64ffc1
### LONG INSTALLATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 0b301f64ffc1
#  ---> dc7e4161f975
# Step 7/7 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in b579e4600247
# Removing intermediate container b579e4600247
#  ---> 3e186a3c6830
# Successfully built 3e186a3c6830
# Successfully tagged custom-nginx:built

docker image ls

# REPOSITORY         TAG       IMAGE ID       CREATED         SIZE
# custom-nginx       built     3e186a3c6830   8 seconds ago   12.8MB
```

之前Ubuntu版本的大小是81.6MB，Alpine版本的大小下降到12.8MB，小了很多。Alpine和Ubuntu不同的地方出来`apk`包管理不一样之外还有一些其他的内容，但是并不重要。如果你使用遇到困难可以在网上寻找答案。

<h3 id="6.8">6.8 怎样创建一个可执行Docker镜像？</h3>

在之前的章节中你使用过了[fhsinchy/rmbyext镜像](https://hub.docker.com/r/fhsinchy/rmbyext)，这一部分中你会学习怎样制作一个可执行的镜像。

首先打开之前在本书中克隆的仓库，rmbyext应用的代码就在同名的目录中。

在开始写Dockerfile之前，思考一下最终的输出应该是什么样的，在我看来应该是这样的：

- 镜像应该要提前安装好[Python](https://hub.docker.com/_/python)。
- 应该包含rmbyext脚本。
- 应该设置一个脚本运行的工作目录。
- rmbyext脚本应该设置为镜像的入口，这样镜像可以把文件扩展名作为参数传递。

为了制作上面描述的镜像，可以按照下面的步骤操作：

- 获取一个支持pytho运行的基础镜像，例如pytohn。
- 设置一个容易访问的工作目录。
- 安装Git以便从Github仓库上安装脚本。
- 使用Git和pip安装脚本。
- 删除运行时不必要依赖的的构建时依赖包。
- 设置rmbyext脚本作为镜像的入口。

现在，在rmbyext目录中创建一个Dockerfile文件，写入如下代码：

```shell
FROM python:3-alpine

WORKDIR /zone

RUN apk add --no-cache git && \
    pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext && \
    apk del git

ENTRYPOINT [ "rmbyext" ]
```

解释如下：

- `FROM`命令设置[python](https://hub.docker.com/_/python)作为基础镜像，提供python脚本运行的环境。`3-alpine`标签表示你使用Alpine的Python3版本。
- `WORKDIR`命令设置`/zone`作为工作目录，这里工作目录的选择完全是随机的，我使用的是`/zone`，你可以自己设定目录。
- rmbyext是从Github中安装的，git是安装时的依赖。第5行的`RUN`命令安装了git并且用git和pip装了rmbyext脚本，随后git被删除。
- 最后在第9行设置rmbyext脚本为镜像入口。

在整个文件中，第9行将普通的镜像转化为了可执行镜像。现在你可以通过下面的命令构建镜像：

```shell
docker image build --tag rmbyext .

# Sending build context to Docker daemon  2.048kB
# Step 1/4 : FROM python:3-alpine
# 3-alpine: Pulling from library/python
# 801bfaa63ef2: Already exists 
# 8723b2b92bec: Already exists 
# 4e07029ccd64: Already exists 
# 594990504179: Already exists 
# 140d7fec7322: Already exists 
# Digest: sha256:7492c1f615e3651629bd6c61777e9660caa3819cf3561a47d1d526dfeee02cf6
# Status: Downloaded newer image for python:3-alpine
#  ---> d4d4f50f871a
# Step 2/4 : WORKDIR /zone
#  ---> Running in 454374612a91
# Removing intermediate container 454374612a91
#  ---> 7f7e49bc98d2
# Step 3/4 : RUN apk add --no-cache git &&     pip install git+https://github.com/fhsinchy/rmbyext.git#egg=rmbyext &&     apk del git
#  ---> Running in 27e2e96dc95a
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 27e2e96dc95a
#  ---> 3c7389432e36
# Step 4/4 : ENTRYPOINT [ "rmbyext" ]
#  ---> Running in f239bbea1ca6
# Removing intermediate container f239bbea1ca6
#  ---> 1746b0cedbc7
# Successfully built 1746b0cedbc7
# Successfully tagged rmbyext:latest

docker image ls

# REPOSITORY         TAG        IMAGE ID       CREATED         SIZE
# rmbyext            latest     1746b0cedbc7   4 minutes ago   50.9MB
```

这里我没有提供给镜像提供任何tag，所以默认的tag是latest。你可以像之前章节那样运行这个镜像，记得引用你设置的镜像名字而不是这里的fhsinchy/rmbyext。

<h3 id="6.9">6.9 怎样在线共享你的镜像？</h3>

现在你知道了怎么制作一个镜像，是时候分享给这个世界了。分享镜像很简单，你只需要具有一个在线镜像仓库的账户，这里我们使用[Docker Hub](https://hub.docker.com/)。

导航到注册页并[注册](https://hub.docker.com/signup)一个免费用户。免费用户可以上传不限制的公共仓库和一个私有仓库。

创建用户之后，你需要使用docker CLI登陆，打开终端执行如下命令：

```shell
docker login

# Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
# Username: fhsinchy
# Password: 
# WARNING! Your password will be stored unencrypted in /home/fhsinchy/.docker/config.json.
# Configure a credential helper to remove this warning. See
# https://docs.docker.com/engine/reference/commandline/login/#credentials-store
#
# Login Succeeded
```

弹出框中要求你输入用户名和密码，如果输入正确，你就能够成功登陆你的账户。

为了能够在线分享镜像，镜像必要要打标签，你已经在上面的章节中学习了打tag，回想一下，基本的语法是：

```shell
--tag <image repository>:<image tag>
```

我们以共享custom-nginx镜像为例，在custom-nginx项目目录中打开一个新的命令行终端。

为了上传镜像，你必须遵照`<docker hub username>/<image name>:<image tag>`语法。我的用户名是fhsinchy，因此命令如下：

```shell
docker image build --tag fhsinchy/custom-nginx:latest --file Dockerfile.built .

# Step 1/9 : FROM ubuntu:latest
#  ---> d70eaf7277ea
# Step 2/9 : RUN apt-get update &&     apt-get install build-essential                    libpcre3                     libpcre3-dev                     zlib1g                     zlib1g-dev                     libssl-dev                     -y &&     apt-get clean && rm -rf /var/lib/apt/lists/*
#  ---> cbe1ced3da11
### LONG INSTALLATION STUFF GOES HERE ###
# Step 3/9 : ARG FILENAME="nginx-1.19.2"
#  ---> Running in 33b62a0e9ffb
# Removing intermediate container 33b62a0e9ffb
#  ---> fafc0aceb9c8
# Step 4/9 : ARG EXTENSION="tar.gz"
#  ---> Running in 5c32eeb1bb11
# Removing intermediate container 5c32eeb1bb11
#  ---> 36efdf6efacc
# Step 5/9 : ADD https://nginx.org/download/${FILENAME}.${EXTENSION} .
# Downloading [==================================================>]  1.049MB/1.049MB
#  ---> dba252f8d609
# Step 6/9 : RUN tar -xvf ${FILENAME}.${EXTENSION} && rm ${FILENAME}.${EXTENSION}
#  ---> Running in 2f5b091b2125
### LONG EXTRACTION STUFF GOES HERE ###
# Removing intermediate container 2f5b091b2125
#  ---> 2c9a325d74f1
# Step 7/9 : RUN cd ${FILENAME} &&     ./configure         --sbin-path=/usr/bin/nginx         --conf-path=/etc/nginx/nginx.conf         --error-log-path=/var/log/nginx/error.log         --http-log-path=/var/log/nginx/access.log         --with-pcre         --pid-path=/var/run/nginx.pid         --with-http_ssl_module &&     make && make install
#  ---> Running in 11cc82dd5186
### LONG CONFIGURATION AND BUILD STUFF GOES HERE ###
# Removing intermediate container 11cc82dd5186
#  ---> 6c122e485ec8
# Step 8/9 : RUN rm -rf /${FILENAME}}
#  ---> Running in 04102366960b
# Removing intermediate container 04102366960b
#  ---> 6bfa35420a73
# Step 9/9 : CMD ["nginx", "-g", "daemon off;"]
#  ---> Running in 63ee44b571bb
# Removing intermediate container 63ee44b571bb
#  ---> 4ce79556db1b
# Successfully built 4ce79556db1b
# Successfully tagged fhsinchy/custom-nginx:latest
```

在命令中，fhsinchy/custom-nginx是镜像仓库，latest是标签，镜像名称可以根据你的喜欢设定并且一旦镜像上传就不能更改。tag你可以随时修改，一般表示应用的版本或者不同的构建。

以`node`镜像为例，`node:lts`镜像表示长期支持的版本，而`node:lts-alpine`版本表示在Alpine Linux上构建的版本，这个版本比其他版本会更小一些。

如果你没有给镜像设置标签，默认的标签是latest，但这并不意味着就是最新的版本，如果你不小心设置一个老的版本为latest，Docker不会校验是否是最新的版本。

镜像创建之后，你就可以通过下面的命令上传它：

```shell
docker image push <image repository>:<image tag>
```

具体到这个例子，你可以使用如下命令：

```shell
docker image push fhsinchy/custom-nginx:latest

# The push refers to repository [docker.io/fhsinchy/custom-nginx]
# 4352b1b1d9f5: Pushed 
# a4518dd720bd: Pushed 
# 1d756dc4e694: Pushed 
# d7a7e2b6321a: Pushed 
# f6253634dc78: Mounted from library/ubuntu 
# 9069f84dbbe9: Mounted from library/ubuntu 
# bacd3af13903: Mounted from library/ubuntu 
# latest: digest: sha256:ffe93440256c9edb2ed67bf3bba3c204fec3a46a36ac53358899ce1a9eee497a size: 1788
```

根据镜像的大小，上传的过程可能要花费一点时间。一旦镜像上传成功，你就可以在你的仓库主页中找到它。

> 冯兄话吉：如果要上传镜像到远程仓库，给镜像重新打包时候必须遵照`<docker hub username>/<image name>:<image tag>`语法，也就是镜像名必须以你`https://hub.docker.com/`上注册的用户名最为开头。比如之前你打的`nginx`镜像是`nginx-custom:built`，你需要执行`docker tag custom-nginx:built arefmzhao/custom-nginx:built_Alpine`(这里tag由built改为built_Alpine，tag可以随意修改)，然后`docker login`正确登录后就可以使用命令`docker push arefmzhao/custom-nginx:built_Alpine`推送到`arefmzhao`这个用户下面。上传后访问[主页](https://hub.docker.com/u/arefmzhao)如图：

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-26.jpg)

---

<h2 id="7">7. 怎样容器化一个Javascript应用？</h2>

现在你学习了怎样创建一个镜像，接下来做一些更相关的内容。

在接下来的章节你将会编写之前用过的[fhsinchy/hello-dock](https://hub.docker.com/r/fhsinchy/hello-dock)镜像的源代码。在容器化这个简单应用的过程中，你将会了解卷（`volume`）和多步构建（`multi stage builds`）这两个Docker重要的概念。

<h3 id="7.1">7.1 怎么写Dockerfile？</h3>

打开你克隆本书的仓库目录，`hello-dock`应用的代码就在同名的子目录中。

这是一个使用[vitejs/vite](https://github.com/vitejs/vite)的非常简单的JavaScript项目，要了解接下来的内容你不需要懂`JavaScript`或者`vite`，只要对[Node.js](https://nodejs.org/)和[npm](https://nodejs.org/)有简单的了解就足够了。

就像之前章节的其他项目一样，你首先要对应用怎么运行有一个规划，在我看来，规划应该是：

- 获取一个运行JavaScript的基础镜像，例如[node](https://hub.docker.com/_/node)。
- 在镜像中设置默认的工作目录。
- 复制`package.json`文件到镜像中。
- 安装必要的依赖。
- 复制其他的项目文件。
- 通过执行`npm run dev`启动vite development服务。

这样的规划通常来自于应用的开发人员，如果你本身是一个开发人员，你应该已经对应用怎么运行有很好的理解了。

如果将上述的规划放在`Dockerfile.dev`中，内容应该是这样的：

```shell
FROM node:lts-alpine

EXPOSE 3000

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./package.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
```

上述命令的解释如下：

- `FROM`命令表示指定Node.js镜像作为基础镜像，该镜像中你可以运行任何的JavaScript应用。`lts-alpine`标签表示你使用的是Alpine的镜像版本，这是一个支持长久维护的镜像版本。所有的tag和文档都可以在[node](https://hub.docker.com/_/node)的hub页面找到。
- `USER`命令设置该镜像默认的user为`node`。默认情况Docker以root用户运行容器，但是根据[Docker和Node.js的最佳实践](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)所示，这样会带来安全上的问题，所以最好尽可能用非root用户。这样node镜像拥有了一个非root的用户叫做`node`，你可以使用`USER`命令来设置默认的用户。
- `RUN mkdir -p /home/node/app/`命令使用node用户在家目录中创建了一个叫`app`的目录。Linux中一般非root用户的家目录默认是`/home/<username>`。
- `WORKDIR`命令设置默认的工作目录为新创建的`/home/node/app`目录。镜像默认的工作目录是root，你也不想一些不必要的文件散落在root目录是吧？因此你改变了默认的工作目录为更有意义的目录`/home/node/app`或者其他你喜欢的目录。接下来的`COPY`、`ADD`和`CMD`等命令都是在该工作目录下执行的。
- `COPY`指令复制`package.json`文件，该文件中包含了应用必要的依赖信息。`RUN`命令执行`npm install`命令，该命令是node项目中使用package.json来安装依赖包的默认命令。`.`代表工作目录。
- 第二个`COPY`命令表示复制文件系统中当前目录(`.`)剩余的内容到Docker镜像的工作目录(`.`)中。
- 最后`CMD`命令用`exec`的格式设置该镜像默认的运行命令为`npm run dev`。
- `vite` development服务默认运行的端口是`3000，`因此用`EXPOSE`命令加以说明是一个很好的选择。

现在使用该Dockerfile.dev文件来构建一个镜像，你可以执行如下指令：

```shell
docker image build --file Dockerfile.dev --tag hello-dock:dev .

Sending build context to Docker daemon  30.21kB
Step 1/9 : FROM node:lts-alpine
lts-alpine: Pulling from library/node
6a428f9f83b0: Pull complete
117b1bf70a74: Pull complete
a19603468f90: Pull complete
1d2672489abb: Pull complete
Digest: sha256:6e52e0b3bedfb494496488514d18bee7fd503fd4e44289ea012ad02f8f41a312
Status: Downloaded newer image for node:lts-alpine
 ---> ee0f6dca428d
Step 2/9 : EXPOSE 3000
 ---> Running in b84f92345310
Removing intermediate container b84f92345310
 ---> 62bad2323eb1
Step 3/9 : USER node
 ---> Running in 8b2a2f5c2cf4
Removing intermediate container 8b2a2f5c2cf4
 ---> ce491fc872e7
Step 4/9 : RUN mkdir -p /home/node/app
 ---> Running in ef00a4c8e5ba
Removing intermediate container ef00a4c8e5ba
 ---> 4704a2a978b5
Step 5/9 : WORKDIR /home/node/app
 ---> Running in 3ce3646c769e
Removing intermediate container 3ce3646c769e
 ---> ec9d8664d283
Step 6/9 : COPY ./package.json .
 ---> 44c0db178033
Step 7/9 : RUN npm install
 ---> Running in 8a475cd9eccf

> esbuild@0.8.57 postinstall /home/node/app/node_modules/esbuild
> node install.js

npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN hello-dock@0.0.0 No description
npm WARN hello-dock@0.0.0 No repository field.
npm WARN hello-dock@0.0.0 No license field.

added 281 packages from 277 contributors and audited 283 packages in 115.576s

31 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Removing intermediate container 8a475cd9eccf
 ---> 917dbe53bca4
Step 8/9 : COPY . .
 ---> 1249c2a1115e
Step 9/9 : CMD [ "npm", "run", "dev" ]
 ---> Running in 034f6aa8f2dc
Removing intermediate container 034f6aa8f2dc
 ---> 0fcff97a7e2f
Successfully built 0fcff97a7e2f
Successfully tagged hello-dock:dev
```

因为`Dockerfile`文件名不是默认的Dockerfile，因此你需要使用`--file`参数来手动指定文件。你可以使用下面的命令来运行一个容器：

```shell
docker container run \
--rm \
--detach \
--publish 3000:3000 \
--name hello-dock-dev \
hello-dock:dev

# 21b9b1499d195d85e81f0e8bce08f43a64b63d589c5f15cbbd0b9c0cb07ae268
```

现在可以通过`http://127.0.0.1:3000`来访问hello-dock应用了。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-15.jpg)

恭喜你成功运行了第一个容器化的应用。你的代码没有问题，但是一些地方还有很大提高的空间，我们首先来看第一个问题。

<h3 id="7.2">7.2 怎么在Docker中进行Bind Mounts(绑定挂载)？</h3>

如果你之前有接触过前端的一些框架，你应该了解这些框架的development服务都有热部署的功能。那就是如果你源代码有所改变，服务端就会reload，任何修改都能够自动的立刻完成重新部署显现出来。

但是如果你现在改变你的源代码，启动的服务不会有任何改变。这是因为你的修改发生在本地文件系统上，而你看到的页面的后台服务的代码是在容器内的文件系统上。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-20.png)

为来解决这个问题，你可以使用[bind mount](https://docs.docker.com/storage/bind-mounts/)，能很容易的实现将本地文件系统的一个目录挂载到容器上。bind mount不是复制了一份本地文件系统中的内容，而是让容器可以直接引用本地文件系统上的内容。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-21.png)

这样在你本地文件系统中改变的内容就会立马体现在容器中，触发vite development服务的热部署。容器中的任何改变也会反映在本地文件系统中。

在[怎样操作可执行镜像](#7.12)章节中我们学习了可以使用`container run`或者`container start`命令的`--volume|-v`参数来创建bind mount，提醒一下，基本的语法是这样的：

```shell
--volume <local file system directory absolute paty>:<container file system directory absolute path>:<read write access>
```

停掉你之前启动的hello-dock-dev容器，使用下面的命令启动一个新的容器：

```shell
docker container run \
--rm \
--publish 3000:3000 \
--name hello-dock-dev \
--volume $(pwd):/home/node/app \
hello-dock:dev

# sh: 1: vite: not found
# npm ERR! code ELIFECYCLE
# npm ERR! syscall spawn
# npm ERR! file sh
# npm ERR! errno ENOENT
# npm ERR! hello-dock@0.0.0 dev: `vite`
# npm ERR! spawn ENOENT
# npm ERR!
# npm ERR! Failed at the hello-dock@0.0.0 dev script.
# npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
# npm WARN Local package.json exists, but node_modules missing, did you mean to install?
```

请注意，我省略了`--detach`参数是为了证明一个重要的内容，终端中可以看出，应用没有运行起来。

这是因为尽管`volume`的使用解决了热部署的问题，它带来了一个新的问题。如果你有node.js的经验，你会知道Node项目的依赖都在根目录下一个`node_modules`目录中。

如今，你将整个Node项目的挂载到本地文件系统的目录上，容器内的`node_modules`目录也被替换了，这样应用就不能正常启动了。

<h3 id="7.3">7.3 怎么使用Docker的匿名卷？</h3>

这个问题可以通过Docker匿名卷的方式解决，匿名卷除了不需要指定一个源目录之外和`bind mount`一样，通用的语法是：

```shell
--volume <container file system directory absolute path>:<read write access>
```

因此基于匿名卷最终运行容器hello-dock的命令是：

```shell
docker container run \
--rm \
--detach \
--publish 3000:3000 \
--name hello-dock-dev \
--volume $(pwd):/home/node/app \
--volume /home/node/app/node_modules \
hello-dock:dev

# 53d1cfdb3ef148eb6370e338749836160f75f076d0fbec3c2a9b059a8992de8b
```

在这里，Docker将容器内`node_modules`整个目录和由Docker daemon管理的匿名卷目录绑定。

<h3 id="7.4">7.4 怎么在Docker中执行多阶段构建（Multi-Staged Builds）？</h3>

目前为止，我们已经在开发环境下可以构建JavaScript应用镜像。如果你要在生产环境中构建一个镜像，新的挑战就出来了。

在生产环境中，`npm run build`编译了所有的JavaScript代码为HTML、CSS和JavaScript文件。运行这些文件，你不在需要node或者其他运行时的依赖。你所需要的是一个像nginx的http服务器。

为了创建在生产环境中运行应用的镜像，你可以按照按照以下步骤：

- 使用node作为基础镜像构建应用。
- 在node镜像中安装nginx并且使用它提供http服务。

上面的办法是可行的，但是问题是node镜像很大并且镜像中的很多东西对于http服务来说都不是必须的，这种情况更好的办法是：

- 使用node作为基础镜像构建应用。
- 复制node镜像中产生的文件到一个nginx镜像中。
- 抛弃node所有相关的东西，基于nginx创建最终的镜像。

这样制作的镜像仅仅包含需要的文件，镜像也会很小。

这种方法是多阶段构建，为了执行这样的构建，在你的hello-dock目录中创建一个新的Dockerfile，写入如下内容：

```shell
FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html
```

这个Dockefile除了新增的一些行外和之前的很类似，命令解释如下：

- 第1行，开始第一阶段的构建，使用`node-alpine`作为基础镜像，`as builder`语法指定了该阶段的一个名称，以便后续能够引用到。
- 第3到9行，这是我们之前看到过多次标准的命令。`RUN npm run build`命令是将整个项目编译并将结果输出到`/app/disk`目录，app目录是指定的工作目录，disk目录是vite默认的文件输出目录。
- 第11行，开启了一个新的bulid阶段，使用`nginx:stable-alpine`作为基础了nginx镜像。
- nginx服务默认监听80端口，因此加上`EXPOSE 80`。
- 最后一行是一个`COPY`命令，`--from=builder`参数表明你想要从builder阶段copy一些东西。那之后是一个标准的copy命令，`/app/dist`是源端、`/usr/share/nginx/html`是目标端。目标端路径使用的是nginx的默认配置路径，该路径下的文件会自动被nginx server读取。

从上面可以看到，生成的镜像以nginx为基础镜像，镜像中仅仅包含运行应用的必要文件。可以通过下面的命令构建镜像：

```shell
docker image build --tag hello-dock:prod .

Sending build context to Docker daemon  30.21kB
Step 1/9 : FROM node:lts-alpine as builder
 ---> ee0f6dca428d
Step 2/9 : WORKDIR /app
 ---> Running in 080b01d9e2d8
Removing intermediate container 080b01d9e2d8
 ---> 15bb688eb4c4
Step 3/9 : COPY ./package.json ./
 ---> 5fd5b06115ea
Step 4/9 : RUN npm install
 ---> Running in 18572629426e

> esbuild@0.8.57 postinstall /app/node_modules/esbuild
> node install.js

npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN hello-dock@0.0.0 No description
npm WARN hello-dock@0.0.0 No repository field.
npm WARN hello-dock@0.0.0 No license field.

added 281 packages from 277 contributors and audited 283 packages in 74.227s

31 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Removing intermediate container 18572629426e
 ---> 878ba2ac11bc
Step 5/9 : COPY . .
 ---> 58d5a0ee61a6
Step 6/9 : RUN npm run build
 ---> Running in a2822f75d72a

> hello-dock@0.0.0 build /app
> vite build

- Building production bundle...

[write] dist/index.html 0.39kb, brotli: 0.15kb
[write] dist/_assets/docker-handbook-github.3adb4865.webp 12.32kb
[write] dist/_assets/index.8504976b.js 46.40kb, brotli: 16.66kb
- Building production bundle...

[write] dist/_assets/style.0637ccc5.css 0.16kb, brotli: 0.10kb
Build completed in 2.57s.

Removing intermediate container a2822f75d72a
 ---> fb55c941aa54
Step 7/9 : FROM nginx:stable-alpine
stable-alpine: Pulling from library/nginx
4e9f2cdf4387: Pull complete
6cac039d45af: Pull complete
7bbb5e46b36d: Pull complete
39f6d17c9d38: Pull complete
a5f9fd374d3b: Pull complete
7d84628ff318: Pull complete
Digest: sha256:2012644549052fa07c43b0d19f320c871a25e105d0b23e33645e4f1bcf8fcd97
Status: Downloaded newer image for nginx:stable-alpine
 ---> 4146b18ae794
Step 8/9 : EXPOSE 80
 ---> Running in 01b01b69c2a9
Removing intermediate container 01b01b69c2a9
 ---> f8d96c5e9afa
Step 9/9 : COPY --from=builder /app/dist /usr/share/nginx/html
 ---> b9d79b0c84b7
Successfully built b9d79b0c84b7
Successfully tagged hello-dock:prod
```

镜像创建后，你可以通过执行下面的命令来运行容器：

```shell
docker container run \
--rm \
--detach \
--name hello-dock-prod \
--publish 8080:80 \
hello-dock:prod

# a2f7cd2244eddf7cb139e223c87fbf35c5d07026ba299f1f6523d00c46e56334
```

可用通过`http://127.0.0.1`来访问启动的服务。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-15.jpg)

这里你可以看到hello-dock应用。多阶段构建在构建有许多依赖的大项目的时候非常有用，如果能够很好的配置，多阶段构建的镜像非常的小并且优化。

<h3 id="7.5">7.5 怎么忽略掉不必要的文件？</h3>

如果你了解过git，你可能会知道.gitignore文件，该文件中包含的一系列文件和目录将会从git仓库中忽略掉。

同样，Docker也有一个类似概念，`.dockerignore`文件中包含一系列的文件和目录会在镜像构建时候忽略，你可以在hello-dock目录中找到`.dockerignore`。

```shell
.git
*Dockerfile*
*docker-compose*
node_modules
```

这个`.dockerignore`只适用在`build`阶段，`.dockerignore`中的文件和目录在`COPY`命令时会被忽略，但是如果你要进行目录挂载，`.dockerignore`就没有任何作用。我会在有必要的项目中添加`.dockerignore`文件。

---

<h2 id="8">8. Docker中的网络操作</h2>

目前为止本书中你只接触到了单个的容器，但是在实际的工作中，你要处理的大部分项目都超过一个容器。事实上，如果你不了解容器隔离的细微差别，就很难协作好多个容器。

因此本书的这一部分你会熟悉Docker网络并能够协作一个小的多容器项目。

从之前的章节中你会了解到容器是一个隔离的环境。现在假设你有一个基于[Express.js](https://expressjs.com/)的notes-api应用和一个[PostgreSQL](https://www.postgresql.org/)数据库服务分别在两个容器上运行。

这两个容器彼此间是完全隔离的并且彼此意识不到对方的存在。**那么两个容器之间如何能够连接起来，是不是很困难？**

你可能会想到这个问题的两个解决方案，它们是：

- 通过暴露的端口访问数据库服务。
- 通过数据库服务器的IP和默认端口访问数据库服务。

第一个方案需要`postgres`容器暴露一个端口，`notes-api`通过这个暴露的端口例如`5432`进行连接。如果你在`notes-api`容器中使用`127.0.0.1:5432`来连接数据库服务，你会发现`note-api`无法找到数据库服务。

原因是当你在`note-api`容器中使用`127.0.0.1`时，你实际上在访问当前容器的`localhost`，`postgres`服务在`notes-api`容器中并不存在，这样也就连接不上。

第二种方案你可能会想用`container inspect`命令找到`postgres`数据库容器的实际IP地址并且使用IP和端口进行连接。假设`postgres`数据库服务容器的名称是`notes-api-db-server`，你可以通过下面的命令，很方便的获得容器的IP地址：

```shell
docker container inspect --format='{{range .NetworkSettings.Networks}} {{.IPAddress}} {{end}}' notes-api-db-server

#  172.17.0.2
```

现在已知`postgres`默认的端口是`5432`，`notes-api`容器可以方便的通过`172.17.0.2:5432`连接到数据库服务。

这种办法也存在问题，实际上使用容器的IP来连接容器是不被推荐的。并且，假设容器被销毁或者被重新创建，容器的IP是会发生改变的，跟踪这些变化的IP是一件很繁琐的事情。

现在否定了原始问题的所有答案，我们给出正确的答案：**将要互联的容器放在一个用户自定义的桥接网络中。**

<h3 id="8.1">8.1 Docker网络基础</h3>

像`container`和`image`一样，`network`是Docker中的另外一个逻辑对象，同样有`docker network`开头的很多命令来管理网络。

列出系统中的所有网络，执行下面的命令：

```shell
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

你能够看到系统中有三个网络，现在看下表格中的`DRIVER`列，该列表示网络的类型。

默认，Docker有5种网络drivers，它们是：

- 桥接（`bridge`）-Docker中的默认网络类型，这种类型适合使用在独立运行的容器并且容器间需要相互通信。
- 主机（`host`）-完全移除了网络的隔离。只要在主机网络下的任何容器都连接到了宿主机网络下。
- 无（`none`）-这种类型容器之间的网络连接，我还没有发现这种类型的任何用处。
- `overlay`-这种类型跨主机连接多个Docker daemon，不在本书的讨论范围之内。
- `macvlan`-它允许给容器分配MAC地址，是容器模拟一个物理设备。

也有第三方的插件允许你整合Docker和特殊的网络栈。在上面5中网络类型中，在本书中你只需要了解桥接网络类型。

<h3 id="8.2">8.2 怎样在Docker中自定义一个桥接网络？</h3>

在创建自定义网络之前，最好花一些时间认识一个Docker默认的桥接网络。从列出系统上的所有网络开始：

```shell
docker network ls

# NETWORK ID     NAME      DRIVER    SCOPE
# c2e59f2b96bd   bridge    bridge    local
# 124dccee067f   host      host      local
# 506e3822bf1f   none      null      local
```

可以看到，Docker有一个默认的桥接网络名字叫做`bridge`，你运行的容器都会自动附接在这个桥接网络下：

```shell
docker container run --rm --detach --name hello-dock --publish 8080:80 fhsinchy/hello-dock
# a37f723dad3ae793ce40f97eb6bb236761baa92d72a2c27c24fc7fda0756657d

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' bridge #原文中是连在一起的，更好的格式化输出，分开
# hello-dock
```

之前有讲到过，附接在这个默认桥接网络下的所有容器相互间可以通过IP通信。

一个自定义的桥接网络相比较默认桥接有一些额外的功能，根据[官方文档](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge)，额外的功能如下：

- **自定义桥接网络提供容器间自动DNS解析功能。**这意味着在同一个自定义桥接网络下的容器间可以通过容器名称通信。因此如果你有两个容器分别是`notes-api`和`notes-db`，那么API容器就可以通过note-db容器名字来连接数据库容器。
- **自定义桥接网络提供更好的容器间的隔离。**所有附接在默认桥接网络下的容器可能会彼此冲突，自定义桥接网络下的容器能确保更好的隔离。
- **容器能够随时附接在或者从自定义桥接中断开连接。**在容器的生命周期中你可以随时附接在或者断开于自定义桥接网络中，从自定义桥接网络中断开容器连接的方法是，首先要停掉容器，然后重新运行容器并指定网络参数。

现在你了解了足够多自定义桥接网络的内容，是时候自己动手创建一个了，可以使用`network create`命令来创建网络，基本的语法如下：

```shell
docker network create <network name>
```

创建一个名称为skynet的网络，命令如下：

```shell
docker network create skynet

# 7bd5f351aa892ac6ec15fed8619fc3bbb95a7dcdd58980c28304627c8f7eb070

docker network ls

# NETWORK ID     NAME     DRIVER    SCOPE
# be0cab667c4b   bridge   bridge    local
# 124dccee067f   host     host      local
# 506e3822bf1f   none     null      local
# 7bd5f351aa89   skynet   bridge    local
```

上面可以看到一个指定名称的网络被创建，目前没有容器附连在这个网络下面，下一部分你会学习如何附接一个容器到一个网络。

<h3 id="8.3">8.3 怎样在Docker中附接一个容器到网络中？</h3>

基本上有两个办法将一个容器附接在一个网络上。首先，你可以使用network的命令来附接容器，基本的语法如下：

```shell
docker network connect <network identifier> <container identifier>
```

为了能够将`hello-dock`容器附接在`skynet`网络下，你可以执行下面的命令：

```shell
docker network connect skynet hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' skynet

#  hello-dock

docker network inspect --format='{{range .Containers}} {{.Name}} {{end}}' bridge

#  hello-dock
```

从上面我们执行两条`network inspect`的输出中可以看到，`hello-dock`容器已经附接在`skynet`和默认`bridge`桥接网络下了。

第二种附接容器在网络下的方法是使用命令`container run|create`命令的`--network`参数，基本的语法如下：

```shell
--network <network identifier>
```

运行另外一个alpine-box容器并附接在同样的网络下，可以执行：

```shell
docker container run --network skynet --rm --name alpine-box -it alpine sh

docker container run --network skynet --rm --name alpine-box -it alpine sh
/ # ping hello-dock
PING hello-dock (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.055 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.052 ms
64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.065 ms
64 bytes from 172.18.0.2: seq=3 ttl=64 time=0.050 ms
64 bytes from 172.18.0.2: seq=4 ttl=64 time=0.076 ms
64 bytes from 172.18.0.2: seq=5 ttl=64 time=0.054 ms
64 bytes from 172.18.0.2: seq=6 ttl=64 time=0.064 ms
^C
--- hello-dock ping statistics ---
7 packets transmitted, 7 packets received, 0% packet loss
round-trip min/avg/max = 0.050/0.059/0.076 ms
```

你可以看到，在`alpine-box`容器中运行`ping hello-dock`能成功联通，因为二容器同在自定义的桥接网络中且具备自动DNS解析的功能。

需要注意的是，要想让自定义DNS解析功能成功，你必须给容器设定自定的名称，用自动生成的容器名称在DNS解析时是无效的。

<h3 id="8.4">8.4 怎样在Docker中将容器从网络中断开连接？</h3>

上面你学习了将一个容器附接在一个网络中，这一节你会学习到如何将一个容器从网络中断开连接。你可以使用`network disconnect`命令来完成，基本的语法如下：

```shell
docker network disconnect <network identifier> <container identifier>
```

将hello-dock容器从skynet网络中断开连接，你可以执行下面的命令：

```shell
docker network disconnect skynet hello-dock
```

和network connect命令一样，network disconnect命令也没有任何输出

<h3 id="8.5">8.5 怎样在Docker中删除网络？</h3>

和其他Docker中的逻辑对象一样，网络可以使用`network rm`命令删除，基本的语法是：

```shell
docker network rm <network identifier>
```

将skynet网络从系统中删除，可以执行如下命令：

```shell
docker network rm skynet
```

你也可以使用`network prune`命令来删除任何系统中没有使用的网络，该命令也具有`-f|--force`和`-a|--all`参数。

---

<h2 id="9">9. 怎样容器化配置一个多容器JavaScript应用？</h2>

现在你学习了足够多的Docker网络知识，在这一部分中，你会学习到如何容器化配置一个完整的多容器项目，该项目包括一个基于Express.js的`notes-api`和PostgreSQL。

在这个项目当中，一共有两个容器需要你用网络将它们连在一起。此外，你将会学习到如环境变量和实名卷（named volume）的概念，我们开始吧。

<h3 id="9.1">9.1 怎样运行一个数据库服务？</h3>

该项目的数据库服务是PostgreSQL，使用的是[官方镜像](https://hub.docker.com/_/postgres)。

根据官方文档，如果运行官方镜像，你必须提供`POSTGRES_PASSWORD`环境变量，我还同时使用`POSTGRES_DB`环境变量作为默认的数据库名称。PostgreSQL默认使用的端口是5432，因此你也需要发布该端口。

运行数据库容器，你可以执行下面的命令：

```shell
docker container run \
    --detach \
    --name=notes-db \
    --env POSTGRES_DB=notesdb \
    --env POSTGRES_PASSWORD=secret \
    --network=notes-api-network \
    postgres:12

# a7b287d34d96c8e81a63949c57b83d7c1d71b5660c87f5172f074bd1606196dc

docker container ls

# CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS      NAMES
# a7b287d34d96   postgres:12   "docker-entrypoint.s…"   About a minute ago   Up About a minute   5432/tcp   notes-db
```

> 冯兄话吉：`container run`命令中的`--network`参数不会自动创建网络，因此要用命令`docker network create notes-api-network`手动创建指定的网络参数。

`--env`参数用在`container run`和`container create`命令中为运行的容器设置环境变量。上面可以看到数据库容器创建成功并且在运行中。

尽管容器成功运行中，还有一个问题。像PostgreSQL、MongoDB和MySQL持久化数据在一个数据目录中。PostgreSQL使用容器内的`/var/lib/postgresql/data`目录持久化数据。那如果由于某种原因容器被删除了，你将失去你所有的数据，为了解决这个问题，需要用到实名卷。

<h3 id="9.2">9.2 怎样在Docker中使用实名卷？</h3>

在之前我们学习了绑定挂载（bind mounts）和匿名卷，所谓的实名卷和匿名卷类似，但是实名卷可以通过名字来引用它。

卷（volume）在Docker中也是一个逻辑对象，可以通过命令行来进行管理。`volume create`命令可以用来创建实名卷。

基本的语法如下：

```shell
docker volume create <volume name>
```

创建一个名称为`notes-db-data`的实名卷，可以执行以下命令：

```shell
docker volume create notes-db-data

# notes-db-data

docker volume ls

# DRIVER    VOLUME NAME
# local     notes-db-data
```

实名卷可以挂载到`notes-db`容器的目录`/var/lib/postgresql/data`目录上，要进行挂载，首先停止并删除`notes-db`容器：

```shell
docker container stop notes-db

# notes-db

docker container rm notes-db

# notes-db
```

现在运行一个新的容器，用--volume或者-v参数进行挂载：

```shell
docker container run \
    --detach \
    --volume notes-db-data:/var/lib/postgresql/data \
    --name=notes-db \
    --env POSTGRES_DB=notesdb \
    --env POSTGRES_PASSWORD=secret \
    --network=notes-api-network \
    postgres:12
935b934076402f2f62b1f885d90026cba58137a1a333c370d1a1a86524f6fb30
```

现在使用`inspect`命令查看`notes-db`容器的挂载是否成功：

```shell
docker container inspect --format='{{range .Mounts}} {{ .Name }} {{end}}' notes-db

#  notes-db-data
```

现在`notes-db-data`的数据将会安全的持久化到卷中并且后面可以复用。这里也可以使用绑定挂载来代替实名卷，只是这种场景我更喜欢使用实名卷。

<h3 id="9.3">9.3 怎样在Docker中查看容器的日志？</h3>

为了查看一个容器的日志，你可以使用`contaier logs`命令，基本的语法是：

```shell
docker container logs <container identifier>
```

获取`notes-db`容器的日志，你可以执行下面的命令：

```shell
docker container logs notes-db

The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.utf8".
The default database encoding has accordingly been set to "UTF8".
The default text search configuration will be set to "english".

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgresql/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... Etc/UTC
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok


Success. You can now start the database server using:

    pg_ctl -D /var/lib/postgresql/data -l logfile start

initdb: warning: enabling "trust" authentication for local connections
You can change this by editing pg_hba.conf or using the option -A, or
--auth-local and --auth-host, the next time you run initdb.
waiting for server to start....2021-10-12 09:05:44.718 UTC [48] LOG:  starting PostgreSQL 12.8 (Debian 12.8-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
2021-10-12 09:05:44.768 UTC [48] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2021-10-12 09:05:44.994 UTC [49] LOG:  database system was shut down at 2021-10-12 09:05:43 UTC
2021-10-12 09:05:45.046 UTC [48] LOG:  database system is ready to accept connections
 done
server started
CREATE DATABASE


/usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*

waiting for server to shut down...2021-10-12 09:05:46.331 UTC [48] LOG:  received fast shutdown request
.2021-10-12 09:05:46.379 UTC [48] LOG:  aborting any active transactions
2021-10-12 09:05:46.381 UTC [48] LOG:  background worker "logical replication launcher" (PID 55) exited with exit code 1
2021-10-12 09:05:46.381 UTC [50] LOG:  shutting down
2021-10-12 09:05:46.750 UTC [48] LOG:  database system is shut down
 done
server stopped

PostgreSQL init process complete; ready for start up.

2021-10-12 09:05:46.888 UTC [1] LOG:  starting PostgreSQL 12.8 (Debian 12.8-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
2021-10-12 09:05:46.888 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2021-10-12 09:05:46.888 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2021-10-12 09:05:47.019 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2021-10-12 09:05:47.203 UTC [76] LOG:  database system was shut down at 2021-10-12 09:05:46 UTC
2021-10-12 09:05:47.255 UTC [1] LOG:  database system is ready to accept connections
```

从57行的日志可以看出来数据库服务已经启动并且等待外部的连接。有参数`--follow|-f`可以让你把终端的输出重定向到日志文件中，得到一个持续输出的文档。

<h3 id="9.4">9.4 怎样在Docker中创建一个网络并且将数据库容器附接到网络中？</h3>

之前我们有学过，为了容器之间能够通信，需要创建一个自定义的网络并且将容器附接到网络中。首先在系统中创建一个名称为notes-api-network的网络：

```shell
docker network create notes-api-network
```

现在将notes-db容器附接在这个网络下，执行下面的命令：

```shell
docker network connect notes-api-network notes-db
```

<h3 id="9.5">9.5 怎样写Dockerfile？</h3>

进入你下载的项目目录，进入`notes-api/api`目录，创建一个新的Dockerfile文件，copy下面的内容进去：

```shell
# stage one
FROM node:lts-alpine as builder

# install dependencies for node-gyp
RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
RUN npm install --only=prod

# stage two
FROM node:lts-alpine

EXPOSE 3000
ENV NODE_ENV=production

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=builder /app/node_modules  /home/node/app/node_modules

CMD [ "node", "bin/www" ]
```

这是一个多阶段的构建，第1阶段使用`node-gyp`进行构建和安装依赖，第2阶段用来运行应用。我简单介绍下相关步骤：

- 阶段1，使用`node:lts-alpine`作为基础镜像并且使用`builder`最为阶段1的阶段名称。
- 第5行，我们安装`python`、`make`和`g++`，`node-gyp`工具运行需要这3个依赖包。
- 第7行，设置`/app`作为工作目录。
- 第9和10行，我们复制`package.json`文件到工作目录中并且安装所有的依赖。
- 阶段2，仍然使用`node:lts-alpine`最为基础镜像。
- 第16行，我们设置`NODE_ENV`环境变量为`production`，要让API正常运行，这个设置相当重要。
- 第18到20行，我们设置默认的用户为node，创建`/home/node/app`目录并且设置该目录为工作目录。
- 第22行，我们复制所有的项目文件，第23行，我们从`builder`阶段复制了`node_modules`目录，该目录中包含所有运行依赖的构建阶段的包。
- 第25行，我们设置了默认的启动命令。

根据Dockerfile构建镜像，执行下面的命令：

```shell
docker image build --tag notes-api .

Sending build context to Docker daemon  37.38kB
Step 1/14 : FROM node:lts-alpine as builder
 ---> ee0f6dca428d
Step 2/14 : RUN apk add --no-cache python make g++
 ---> Running in 68e2bb1a2f38
fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/community/x86_64/APKINDEX.tar.gz
(1/21) Installing binutils (2.33.1-r1)
(2/21) Installing gmp (6.1.2-r1)
(3/21) Installing isl (0.18-r0)
(4/21) Installing libgomp (9.3.0-r0)
(5/21) Installing libatomic (9.3.0-r0)
(6/21) Installing mpfr4 (4.0.2-r1)
(7/21) Installing mpc1 (1.1.0-r1)
(8/21) Installing gcc (9.3.0-r0)
(9/21) Installing musl-dev (1.1.24-r3)
(10/21) Installing libc-dev (0.7.2-r0)
(11/21) Installing g++ (9.3.0-r0)
(12/21) Installing make (4.2.1-r2)
(13/21) Installing libbz2 (1.0.8-r1)
(14/21) Installing expat (2.2.9-r1)
(15/21) Installing libffi (3.2.1-r6)
(16/21) Installing gdbm (1.13-r1)
(17/21) Installing ncurses-terminfo-base (6.1_p20200118-r4)
(18/21) Installing ncurses-libs (6.1_p20200118-r4)
(19/21) Installing readline (8.0.1-r0)
(20/21) Installing sqlite-libs (3.30.1-r2)
(21/21) Installing python2 (2.7.18-r0)
Executing busybox-1.31.1-r10.trigger
OK: 212 MiB in 37 packages
Removing intermediate container 68e2bb1a2f38
 ---> 986e49e94c73
Step 3/14 : WORKDIR /app
 ---> Running in f0f0f4656ace
Removing intermediate container f0f0f4656ace
 ---> 851dfc6767fc
Step 4/14 : COPY ./package.json .
 ---> 1e545000fd96
Step 5/14 : RUN npm install --only=prod
 ---> Running in 6647d1ff3261
npm WARN deprecated @hapi/joi@17.1.1: Switch to 'npm install joi'
npm WARN deprecated @hapi/formula@2.0.0: Moved to 'npm install @sideway/formula'
npm WARN deprecated @hapi/address@4.1.0: Moved to 'npm install @sideway/address'
npm WARN deprecated @hapi/pinpoint@2.0.0: Moved to 'npm install @sideway/pinpoint'
npm WARN deprecated node-pre-gyp@0.11.0: Please upgrade to @mapbox/node-pre-gyp: the non-scoped node-pre-gyp package is deprecated and only the @mapbox scoped package will recieve updates in the future
npm WARN deprecated sane@4.1.0: some dependency vulnerabilities fixed, support for node < 10 dropped, and newer ECMAScript syntax/features added
npm WARN deprecated request-promise-native@1.0.9: request-promise-native has been deprecated because it extends the now deprecated request package, see https://github.com/request/request/issues/3142
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^2.1.2 (node_modules/jest-haste-map/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN notes-api@ No description
npm WARN notes-api@ No repository field.
npm WARN notes-api@ No license field.

added 270 packages from 220 contributors and audited 1159 packages in 97.357s

4 packages are looking for funding
  run `npm fund` for details

found 20 vulnerabilities (7 moderate, 13 high)
  run `npm audit fix` to fix them, or `npm audit` for details
Removing intermediate container 6647d1ff3261
 ---> bd0ec09c1fe5
Step 6/14 : FROM node:lts-alpine
 ---> ee0f6dca428d
Step 7/14 : EXPOSE 3000
 ---> Using cache
 ---> 62bad2323eb1
Step 8/14 : ENV NODE_ENV=production
 ---> Running in 815df9f36de5
Removing intermediate container 815df9f36de5
 ---> 8b8f5bb002c4
Step 9/14 : USER node
 ---> Running in 0192718e8951
Removing intermediate container 0192718e8951
 ---> 1ca7806f6ccf
Step 10/14 : RUN mkdir -p /home/node/app
 ---> Running in 2e60b90beda2
Removing intermediate container 2e60b90beda2
 ---> ca808882bd72
Step 11/14 : WORKDIR /home/node/app
 ---> Running in d6c16b514ffb
Removing intermediate container d6c16b514ffb
 ---> 23efd3c64dbe
Step 12/14 : COPY . .
 ---> e9a07ac8e9c8
Step 13/14 : COPY --from=builder /app/node_modules  /home/node/app/node_modules
 ---> 641798a416af
Step 14/14 : CMD [ "node", "bin/www" ]
 ---> Running in a5ccf9b8c68c
Removing intermediate container a5ccf9b8c68c
 ---> 23749f0a35c9
Successfully built 23749f0a35c9
Successfully tagged notes-api:latest
```

在使用构建出来的镜像运行容器之前，确保数据库容器是运行的并且已经附接在notes-api-network网络下。

```shell
docker container inspect notes-db

# [
#     {
#         ...
#         "State": {
#             "Status": "running",
#             "Running": true,
#             "Paused": false,
#             "Restarting": false,
#             "OOMKilled": false,
#             "Dead": false,
#             "Pid": 11521,
#             "ExitCode": 0,
#             "Error": "",
#             "StartedAt": "2021-01-26T06:55:44.928510218Z",
#             "FinishedAt": "2021-01-25T14:19:31.316854657Z"
#         },
#         ...
#         "Mounts": [
#             {
#                 "Type": "volume",
#                 "Name": "notes-db-data",
#                 "Source": "/var/lib/docker/volumes/notes-db-data/_data",
#                 "Destination": "/var/lib/postgresql/data",
#                 "Driver": "local",
#                 "Mode": "z",
#                 "RW": true,
#                 "Propagation": ""
#             }
#         ],
#         ...
#         "NetworkSettings": {
#             ...
#             "Networks": {
#                 "bridge": {
#                     "IPAMConfig": null,
#                     "Links": null,
#                     "Aliases": null,
#                     "NetworkID": "e4c7ce50a5a2a49672155ff498597db336ecc2e3bbb6ee8baeebcf9fcfa0e1ab",
#                     "EndpointID": "2a2587f8285fa020878dd38bdc630cdfca0d769f76fc143d1b554237ce907371",
#                     "Gateway": "172.17.0.1",
#                     "IPAddress": "172.17.0.2",
#                     "IPPrefixLen": 16,
#                     "IPv6Gateway": "",
#                     "GlobalIPv6Address": "",
#                     "GlobalIPv6PrefixLen": 0,
#                     "MacAddress": "02:42:ac:11:00:02",
#                     "DriverOpts": null
#                 },
#                 "notes-api-network": {
#                     "IPAMConfig": {},
#                     "Links": null,
#                     "Aliases": [
#                         "37755e86d627"
#                     ],
#                     "NetworkID": "06579ad9f93d59fc3866ac628ed258dfac2ed7bc1a9cd6fe6e67220b15d203ea",
#                     "EndpointID": "5b8f8718ec9a5ec53e7a13cce3cb540fdf3556fb34242362a8da4cc08d37223c",
#                     "Gateway": "172.18.0.1",
#                     "IPAddress": "172.18.0.2",
#                     "IPPrefixLen": 16,
#                     "IPv6Gateway": "",
#                     "GlobalIPv6Address": "",
#                     "GlobalIPv6PrefixLen": 0,
#                     "MacAddress": "02:42:ac:12:00:02",
#                     "DriverOpts": {}
#                 }
#             }
#         }
#     }
# ]
```

为了方便展示，这里我省略了一些信息。在我的系统中，`notes-db`容器是运行的，该容器挂载了`notes-db-data`卷并且附接在桥接网络`notes-api-network`下。

确保所有的都正确后，你可以用下面的命令运行一个新的容器：

```shell
docker container run \
    --detach \
    --name=notes-api \
    --env DB_HOST=notes-db \
    --env DB_DATABASE=notesdb \
    --env DB_PASSWORD=secret \
    --publish=3000:3000 \
    --network=notes-api-network \
    notes-api

# a037399446fe41362cf3e485478585f20e0d3f702b2fcda62fdfb01b63ed5e0a
```

你应该能够自己能够理解这个长长的命令，因此我只对环境变量做简单的说明。

notes-api容器需要设置三个环境变量，它们是：

- `DB_HOST`-这个是数据库服务的主机名。由于数据库服务和API都附接在同一个自定义的桥接网络下，数据库服务可以使用容器名称`notes-db`来进行引用。
- `DB_DATABASE`-API使用的数据库。在[运行数据库服务](#9.1)部分，我们通过环境变量`POSTGRES_DB`设置了默认的数据库名称为`notesdb`，正是我们使用的这个。
- `DB_PASSWORD`-连接数据库的密码。这个变量也是通过[之前](#9.1)的环境变量`POSTGRES_PASSWORD`设置过。

查看应用是否正常启动，可以使用下面的命令：

```shell
docker container ls

# CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
# f9ece420872d   notes-api     "docker-entrypoint.s…"   12 minutes ago   Up 12 minutes   0.0.0.0:3000->3000/tcp   notes-api
# 37755e86d627   postgres:12   "docker-entrypoint.s…"   17 hours ago     Up 14 minutes   5432/tcp                 notes-db
```

现在，容器在运行中，你可以通过`http://127.0.0.1:3000/`来访问一下API。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-23.jpg)

> 冯兄话吉：上图所示服务不能正常访问，需执行后续的数据初始化工作才能正常，上面看到的页面是正常的（基于上面执行的命令）。

该API共有5个路由，你可以在`/notes-api/api/api/routes/notes.js`查看。

尽管容器在运行中，在正式使用之前仍然有最后一件事情要做。你必需要进行必要的数据库迁移来设置数据库中的表，在容器中执行`npm run db:migrate`来完成。

<h3 id="9.6">9.6 怎样在运行的容器中执行命令？</h3>

在运行中的容器内执行命令，你需要用到`exec`命令，基本的语法是：

```shell
docker container exec <container identifier> <command>
```

在notes-api容器中执行`rpm run db:migrate`命令，你需要执行下面的命令：

```shell
docker container exec notes-api npm run db:migrate
COPY
```

如果你想用命令行交互的方式在容器内执行命令，必须要使用`-it`参数。例如你想在运行中的`notes-api`容器中启动交互式`shell`，你可以执行下面的命令：

```shell
docker container exec -it notes-api sh

# / # uname -a
# Linux a037399446fe 5.10.16.3-microsoft-standard-WSL2 #1 SMP Fri Apr 2 22:23:49 UTC 2021 x86_64 Linux
```

<h3 id="9.7">9.7 怎样写管理Docker的脚本？</h3>

管理一个带有卷和网络的多容器项目意味着有很多命令，为了简化这个过程，我通常用简单的`shell scripts`和`Makefile`。

你可以在`notes-api`目录中找到4个shell scripts，它们分别是：

- `boot.sh`-用来启动已经存在的容器。
- `build.sh`-用来创建并运行容器，如果必要的话也会创建卷和网络。
- `destroy.js`-删除该项目所有容器、卷及网络。
- `stop.js`-停掉所有的容器。

有一个`Makefile`包含了4个目标叫做`start`、`stop`、`build`和`destory`，每一个目标都是调用上面4个shell scripts。

如果系统中容器处于运行态，执行`make stop`命令应该停掉所有的容器。执行`make destory`应该停掉所有的容器并且删除所有的相关内容。确保你在`notes-api`目录中：

```shell
make destroy

# ./shutdown.sh
# stopping api container --->
# notes-api
# api container stopped --->

# stopping db container --->
# notes-db
# db container stopped --->

# shutdown script finished

# ./destroy.sh
# removing api container --->
# notes-api
# api container removed --->

# removing db container --->
# notes-db
# db container removed --->

# removing db data volume --->
# notes-db-data
# db data volume removed --->

# removing network --->
# notes-api-network
# network removed --->

# destroy script finished
```

如果你遇到了permission denied的错误，你需要在脚本上执行`sudo chmod +x *.sh`：

```shell
chmod +x boot.sh build.sh destroy.sh shutdown.sh
```

在这里不再解释这些脚本，因为它们都是一些`if-else`指令加上见过很多次的`Docker`命令。如果你有了解Linux Shell，你应该能够理解脚本中的内容。

---

<h2 id="10">10. 怎样使用Docker-Compose？</h2>

在上一章节，你学习了如何管理一个多容器的项目和解决相关的问题。存在有一个不用写那么多命令并且能够更方便管理多容器的工具，它叫做[Docker Compose](https://docs.docker.com/compose/)。

根据Docker[官方文档](https://docs.docker.com/compose/)，Docker Compose是一个定义并运行多容器的工具。使用Compose你可以用一个YAML文件配置相关应用服务，使用一行命令就可以做到创建并启动配置的所有的服务。

尽管Docker Compose可以运行在各种环境中，但是它更适合用在开发和测试环境中，不推荐在生产环境中使用。

<h3 id="10.1">10.1 Docker Compose基础</h3>

进入你复制本项目的目录，进入`notes-api/api`目录，创建一个命名为Dockerfile.dev的文件，将下面的代码复制进去：

```shell
# stage one
FROM node:lts-alpine as builder

# install dependencies for node-gyp
RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
RUN npm install

# stage two
FROM node:lts-alpine

ENV NODE_ENV=development

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .
COPY --from=builder /app/node_modules /home/node/app/node_modules

CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
```

这里的代码基本上和上一章节的`Dockerfile`的代码一致，不同的地方在于：

- 第10行，不使用`npm run install --only=prod`而是使用`npm install`，因为我们也需要开发时的依赖。
- 第15行，我们设置环境变量`NODE_ENV`为`development`而不是`production`。
- 第24行，我们使用一个[nodemon](https://nodemon.io/)的工具进行API的热部署。

你已经知道这个项目共包含两个容器：

- `notes-db`，一个PostgreSQL数据库服务。
- `notes-api`，基于Express.js的REST API。

在compose这里，应用中的每一个容器被定义为一个service，compose应用第一步是要定义这些service。

就像Docker后台使用Dockerfile来构建镜像一样，Docker Compose使用一个`docker-compose.yaml`文件定义service。

进入notes-api目录并创建一个新的docker-compose.yaml文件，复制下面的代码到文件中：

```shell
version: "3.8"

services: 
    db:
        image: postgres:12
        container_name: notes-db-dev
        volumes: 
            - notes-db-dev-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
    api:
        build:
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        environment: 
            DB_HOST: db ## same as the database service name
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        volumes: 
            - /home/node/app/node_modules
            - ./api:/home/node/app
        ports: 
            - 3000:3000

volumes:
    notes-db-dev-data:
        name: notes-db-dev-data
```

每一个有效的`docker-compose.yaml`文件在开头都会定义个一个版本，写作时最新的版本是`3.8`，你可以在[这里](https://docs.docker.com/compose/compose-file/)找到最新的版本。

`YAML`文件是用缩进定义不同的块，我将讲解每一个块的内容：

- `services`块定义应用的每一个容器或者服务，该项目中的两个services分别是api和db。
- `db`块定义了应用的db服务并且包含了启动容器的所有信息。每一个服务需要一个提前构建好的镜像或者一个`Dockerfile`来运行容器。对于该`db`服务使用的是官方的`PostgreSQL`镜像。
- 和`db`服务不同，`api`服务没有预编译的镜像使用，因此我们使用`Dockerfile.dev`。
- `volumes`块定义你需要的任何的卷。这里仅仅定义了db服务需要的`notes-db-dev-data`卷。

现在你对docker-compose.yaml有一个整体的认识，我们进一步仔细看下单个服务。

db服务的定义如下：

```shell
db:
    image: postgres:12
    container_name: notes-db-dev
    volumes: 
        - db-data:/var/lib/postgresql/data
    environment:
        POSTGRES_DB: notesdb
        POSTGRES_PASSWORD: secret
```

- `image`内容定义了该容器的镜像仓库和tag，我们使用的是运行数据库容器的`postgres:12`镜像。
- `container_name`内容定义了容器的名称，默认情况下容器名称定义为`<project directory name>_<service name>`语法格式。你可以用容器的名称`<container name>`进行覆写。
- `volumes`数组内容定义了服务的卷映射，支持实名卷、匿名卷和挂载绑定。语法`<source>:<destination>`和你之前看到的一样。
- `environment`内容定义的服务运行需要的不同环境变量。

`api`服务的定义代码如下：

```shell
api:
    build:
        context: ./api
        dockerfile: Dockerfile.dev
    image: notes-api:dev
    container_name: notes-api-dev
    environment: 
        DB_HOST: db ## same as the database service name
        DB_DATABASE: notesdb
        DB_PASSWORD: secret
    volumes: 
        - /home/node/app/node_modules
        - ./api:/home/node/app
    ports: 
        - 3000:3000
```

- `api`服务没有一个预构建好的镜像，因此这里设置构建的参数。在`build`块下我们定义了上下文和用于构建镜像的Dockerfile，你现在应该能够理解上下文和Dockerfile，因为我们不做过多的解释了。
- `image`内容代表要构建的镜像的名称。如果没有指定默认将会遵照`<project directory name>_<service name>`的语法格式。
- 在`environment`映射中，`DB_HOST`变量证实了compose的一个功能，那就是你可以在同一项目下引用另外一个服务的名称，在这里就是`db`，它将会在容器中被替换为`api`服务的IP地址。`DB_DATABASE`和`DB_PASSWORD`变量和`db`服务中的`POSTGRE_DB`和`POSTGRE_PASSWORD`相对应。
- 在`volumes`映射中，你可以看到有一个匿名卷和绑定挂载被定义。其语法和之前看到的一样。
- `ports`映射定义了端口的映射。语法`<host port>:<container port>`和之前用的`--publish`语法一样。

最后`volumes`的代码如下：

```shell
volumes:
    db-data:
        name: notes-db-dev-data
```

任何实名卷都可以在这里定义，如果你没有给卷定义一个名称，卷名将遵照`<project directory name>_<volume_key>`的语法格式，这里的key是`db-data`。

你可以在[这里](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes)了解更多卷相关的配置。

<h3 id="10.2">10.2 Docker Compose中如何启动服务？</h3>

有多种方法可以启动定义在YAML文件中的服务，首先要学习的是`up`命令，`up`命令会一口气构建缺失的镜像、创建并启动容器。

在你执行命令之前，确保你打开终端的目录中有`docker-compose.yaml`文件，这对于你要执行的`docker-compose`命令来说很重要。

```shell
docker-compose --file docker-compose.yaml up --detach

# Creating network "notes-api_default" with the default driver
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
#
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 197056ec1964
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 197056ec1964
#  ---> 6609935fe50b
# Step 3/13 : WORKDIR /app
#  ---> Running in 17010f65c5e7
# Removing intermediate container 17010f65c5e7
#  ---> b10d12e676ad
# Step 4/13 : COPY ./package.json .
#  ---> 600d31d9362e
# Step 5/13 : RUN npm install
#  ---> Running in a14afc8c0743
### LONG INSTALLATION STUFF GOES HERE ###
#  Removing intermediate container a14afc8c0743
#  ---> 952d5d86e361
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Running in 0d5376a9e78a
# Removing intermediate container 0d5376a9e78a
#  ---> 910c081ce5f5
# Step 8/13 : USER node
#  ---> Running in cfaefceb1eff
# Removing intermediate container cfaefceb1eff
#  ---> 1480176a1058
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Running in 3ae30e6fb8b8
# Removing intermediate container 3ae30e6fb8b8
#  ---> c391cee4b92c
# Step 10/13 : WORKDIR /home/node/app
#  ---> Running in 6aa27f6b50c1
# Removing intermediate container 6aa27f6b50c1
#  ---> 761a7435dbca
# Step 11/13 : COPY . .
#  ---> b5d5c5bdf3a6
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> 9e1a19960420
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Running in 5bdd62236994
# Removing intermediate container 5bdd62236994
#  ---> 548e178f1386
# Successfully built 548e178f1386
# Successfully tagged notes-api:dev
# Creating notes-api-dev ... done
# Creating notes-db-dev  ... done
```

这里的`--detach|-d`参数和之前看到的参数功能一致，`--file|-f`参数当你需要指定命名非`docker-compose.yaml`文件时使用（这里用`-f`指定文件名是为了证明这个功能）。

除了`up`命令之外还有`start`命令可以启动，二者的区别在于`start`命令不会创建缺失的容器，仅仅会启动已经存在的容器，和`container start`命令是一样的。

`up`命令的`--build`参数强制重新构建镜像，还有其他的一些参数，可以查看[官方文档](https://docs.docker.com/compose/reference/up/)

<h3 id="10.3">10.3 Docker Compose如何展示服务？</h3>

尽管Compose启动的容器也可以通过`container ls`命令来展示，有一个`ps`命令可以只展示出YAML文件中定义的容器。

```shell
 docker-compose ps
    Name                   Command               State                    Ports
-------------------------------------------------------------------------------------------------
notes-api-dev   docker-entrypoint.sh ./nod ...   Up      0.0.0.0:3000->3000/tcp,:::3000->3000/tcp
notes-db-dev    docker-entrypoint.sh postgres    Up      5432/tcp
```

展示的内容没有`container ls`那么详尽，但是如果你同时运行很多的容器，这个语法还是很有用的。

<h3 id="10.4">10.4 怎样在Docker Compose运行的服务中执行命令？</h3>

你应该记得在之前的章节使用命令执行过迁移脚本的工作来创建API服务的数据库表。

就像`container exec`命令一样，`docker-compose`命令也可以使用`exec`，基本的语法如下：

```shell
docker-compose exec <service name> <command>
```

在`api`服务中执行`npm run db:migrate`命令，你可以做如下操作：

```shell
docker-compose exec api npm run db:migrate

# > notes-api@ db:migrate /home/node/app
# > knex migrate:latest
# 
# Using environment: development
# Batch 1 run: 1 migrations
```

> 冯兄话吉：这里`exec`后面的参数是`<service name`而不是容器的标识。

和`container exec`不同，你不需要`-it`参数来进行命令行交互，`docker-compose`自动给你做了。

<h3 id="10.5">10.5 怎样在Docker Compose中查看运行的服务的日志？</h3>

你可以使用`logs`命令来获取运行中服务的日志，基本的语法是：

```shell
docker-compose logs <service name>
```

从`api`服务中获取日志，执行如下命令：

```shell
docker-compose logs api

Attaching to notes-api-dev
notes-api-dev | [nodemon] 2.0.13
notes-api-dev | [nodemon] reading config ./nodemon.json
notes-api-dev | [nodemon] to restart at any time, enter `rs`
notes-api-dev | [nodemon] or send SIGHUP to 1 to restart
notes-api-dev | [nodemon] ignoring: *.test.js
notes-api-dev | [nodemon] watching path(s): *.*
notes-api-dev | [nodemon] watching extensions: js,mjs,json
notes-api-dev | [nodemon] starting `node bin/www`
notes-api-dev | [nodemon] forking
notes-api-dev | [nodemon] child pid: 21
notes-api-dev | [nodemon] watching 19 files
notes-api-dev | app running -> http://127.0.0.1:3000
```

这只是部分日志，你可以通过`-f|--follow`参数将日志流重定向到文件中，运行中服务后续的日志将持续不断输出到文件中直到你按下`ctrl + c`键或者关闭窗口，关闭或者退出日志窗口不会影响容器的运行。

<h3 id="10.6">10.6 怎样在Docker Compose中停止运行的服务？</h3>

你有两种办法来停掉服务，第一个是使用`down`命令，该命令会停掉所有的容器并且从系统中删除，它也会删除所有的网络：

```shell
docker-compose down --volumes

Stopping notes-db-dev  ... done
Stopping notes-api-dev ... done
Removing notes-db-dev  ... done
Removing notes-api-dev ... done
Removing network notes-api_default
Removing volume notes-db-dev-data
```

`--volumes`参数表示你想删除所有定义在`volumes`块中的实名卷，你可以在[官方文档](https://docs.docker.com/compose/reference/down/)中了解更多`down`命令的参数。

另外一个停掉服务的办法是用`stop`命令，功能和`container stop`命令一样。它会停掉应用的所有容器，这些容器会在后续`start`或者`up`命令中启动。

<h3 id="10.7">10.7 怎样Compose一个全栈应用？</h3>

在这一章节中我们将给notes API增加一个前端并且将之转化为一个全栈的应用。这里不会再解释`Dockerfile.dev`(除了nginx服务外)，因为它们在之前的章节已经出现过多次。

如果你克隆过项目仓库，进入`fullstack-notes-application`目录，项目根目录下的每一个目录都包含代码和服务及其相关的`Dockerfile`。

在我们使用`docker-compose.yaml`文件启动项目之前，先让我们看一下该应用是如何工作的：

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-24.png)

不像我们之前那样直接请求，该应用所有的请求会先到NGINX（让我们称之为路由）服务那里。

路由将会查看是否请求中包含`/api`内容，如果是，路由将会请求到后端服务，如果不是，路由将会请求到前端服务。

这样做的原因是，前端的应用不是在容器中运行的，而是在浏览器中，容器只提供服务。这样，Compose网络就会失效，前端应用找不到`api`服务。

NGINX，在容器中运行，能够和整个应用中的不同服务进行通信。

我不会在这里深入的解释NGINX的配置，该内容超出了本书的范围。如果你想看具体配置，查看文件`/fullstack-notes-application/nginx/development.conf`和`/fullstack-notes-application/nginx/production.conf`。`/fullstack-notes-application/nginx/Dockerfile.dev`代码如下：

> 冯兄话吉：上述路径原文指向有误。

```shell
FROM nginx:stable-alpine

COPY ./development.conf /etc/nginx/conf.d/default.conf
```

它所做的是将配置文件copy到容器内的`/etc/nginx/conf.d/default.conf`中。

我们开始书写`docker-compose.yaml`文件，除了`api`和`db`服务外，还有`client`和`nginx`服务，还有一些网络的定义稍后会做出说明：

```shell
version: "3.8"

services: 
    db:
        image: postgres:12
        container_name: notes-db-dev
        volumes: 
            - db-data:/var/lib/postgresql/data
        environment:
            POSTGRES_DB: notesdb
            POSTGRES_PASSWORD: secret
        networks:
            - backend
    api:
        build: 
            context: ./api
            dockerfile: Dockerfile.dev
        image: notes-api:dev
        container_name: notes-api-dev
        volumes: 
            - /home/node/app/node_modules
            - ./api:/home/node/app
        environment: 
            DB_HOST: db ## same as the database service name
            DB_PORT: 5432
            DB_USER: postgres
            DB_DATABASE: notesdb
            DB_PASSWORD: secret
        networks:
            - backend
    client:
        build:
            context: ./client
            dockerfile: Dockerfile.dev
        image: notes-client:dev
        container_name: notes-client-dev
        volumes: 
            - /home/node/app/node_modules
            - ./client:/home/node/app
        networks:
            - frontend
    nginx:
        build:
            context: ./nginx
            dockerfile: Dockerfile.dev
        image: notes-router:dev
        container_name: notes-router-dev
        restart: unless-stopped
        ports: 
            - 8080:80
        networks:
            - backend
            - frontend

volumes:
    db-data:
        name: notes-db-dev-data

networks: 
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

该文件几乎和我们之前见到的一样，需要做出解释的是`network`块，代码如下：

```shell
networks: 
    frontend:
        name: fullstack-notes-application-network-frontend
        driver: bridge
    backend:
        name: fullstack-notes-application-network-backend
        driver: bridge
```

这里我定义了两个网络，默认情况下，Compose会定义一个桥接网络将所有的容器都附接在这个网络下。这个项目中我想要更好的网络隔离，因此定义了两个网络，一个是给前端用一个给后端用。

在每一个服务的定义里我也加入了`networks`块，这样`api`和`db`服务将在一个网络下，`client`将在一个分开的网络下。但是`nginx`服务将都是附接在两个网络下，这样才能够路由到前端和后端的服务。

执行下面的命令启动所有的服务：

```shell
docker-compose --file docker-compose.yaml up --detach

# Creating network "fullstack-notes-application-network-backend" with driver "bridge"
# Creating network "fullstack-notes-application-network-frontend" with driver "bridge"
# Creating volume "notes-db-dev-data" with default driver
# Building api
# Sending build context to Docker daemon  37.38kB
# 
# Step 1/13 : FROM node:lts-alpine as builder
#  ---> 471e8b4eb0b2
# Step 2/13 : RUN apk add --no-cache python make g++
#  ---> Running in 8a4485388fd3
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container 8a4485388fd3
#  ---> 47fb1ab07cc0
# Step 3/13 : WORKDIR /app
#  ---> Running in bc76cc41f1da
# Removing intermediate container bc76cc41f1da
#  ---> 8c03fdb920f9
# Step 4/13 : COPY ./package.json .
#  ---> a1d5715db999
# Step 5/13 : RUN npm install
#  ---> Running in fabd33cc0986
### LONG INSTALLATION STUFF GOES HERE ###
# Removing intermediate container fabd33cc0986
#  ---> e09913debbd1
# Step 6/13 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 7/13 : ENV NODE_ENV=development
#  ---> Using cache
#  ---> b7c12361b3e5
# Step 8/13 : USER node
#  ---> Using cache
#  ---> f5ac66ca07a4
# Step 9/13 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 60094b9a6183
# Step 10/13 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> 316a252e6e3e
# Step 11/13 : COPY . .
#  ---> Using cache
#  ---> 3a083622b753
# Step 12/13 : COPY --from=builder /app/node_modules /home/node/app/node_modules
#  ---> Using cache
#  ---> 707979b3371c
# Step 13/13 : CMD [ "./node_modules/.bin/nodemon", "--config", "nodemon.json", "bin/www" ]
#  ---> Using cache
#  ---> f2da08a5f59b
# Successfully built f2da08a5f59b
# Successfully tagged notes-api:dev
# Building client
# Sending build context to Docker daemon  43.01kB
# 
# Step 1/7 : FROM node:lts-alpine
#  ---> 471e8b4eb0b2
# Step 2/7 : USER node
#  ---> Using cache
#  ---> 4be5fb31f862
# Step 3/7 : RUN mkdir -p /home/node/app
#  ---> Using cache
#  ---> 1fefc7412723
# Step 4/7 : WORKDIR /home/node/app
#  ---> Using cache
#  ---> d1470d878aa7
# Step 5/7 : COPY ./package.json .
#  ---> Using cache
#  ---> bbcc49475077
# Step 6/7 : RUN npm install
#  ---> Using cache
#  ---> 860a4a2af447
# Step 7/7 : CMD [ "npm", "run", "serve" ]
#  ---> Using cache
#  ---> 11db51d5bee7
# Successfully built 11db51d5bee7
# Successfully tagged notes-client:dev
# Building nginx
# Sending build context to Docker daemon   5.12kB
# 
# Step 1/2 : FROM nginx:stable-alpine
#  ---> f2343e2e2507
# Step 2/2 : COPY ./development.conf /etc/nginx/conf.d/default.conf
#  ---> Using cache
#  ---> 02a55d005a98
# Successfully built 02a55d005a98
# Successfully tagged notes-router:dev
# Creating notes-client-dev ... done
# Creating notes-api-dev    ... done
# Creating notes-router-dev ... done
# Creating notes-db-dev     ... done
```

现在访问`http://localhost:8080`并验证。

![](https://gitee.com/fengmengzhao/fengmengzhao.github.io/raw/master/img/posts/docker-handbook-2021-25.jpg)

尝试增加或者删除notes验证应用是否能正常工作。这个项目也可以用shell scripts和Makefile完成，可以尝试像之前章节那样不使用Docker Compose来运行项目。

> 冯兄话吉：访问页面操作创建notes功能不能正常保存日记，是因为数据库没有执行初始化建表操作，使用命令`docker-compose exec api npm run db:migrate`即可完成初始化，重新保存日记，功能正常。

---

<h2 id="11">11. 结论</h2>

十分感谢您的时间阅读本书，希望你喜欢他并且学会的Docker的所有基础知识。

除了这一篇，我还写了关于其他主题的长篇指导性手册，可以在[freeCodeCamp](https://www.freecodecamp.org/news/the-docker-handbook/freecodecamp.org/news/author/farhanhasin/)中看到。

这些手册都是我秉承着努力简化每个人对技术的理解的热情写的，每一本都花费了大量的时间和精力。

如果你喜欢我的写作并且鼓励支持我，可以在我的[Github](https://github.com/fhsinchy/)给我点赞，或者在[LinkedIn](https://www.linkedin.com/in/farhanhasin/)界面认可我的相关技能。我也欢迎您赞助我[一杯咖啡的钱](https://www.buymeacoffee.com/farhanhasin)。

您有任何意见或者建议可以在[这些平台](https://linktr.ee/farhanhasin)留言，也可以在[Twitter](https://twitter.com/frhnhsin)或者[LinkedIn](https://www.linkedin.com/in/farhanhasin/)上关注我，直接给我留言。

最后，建议将好东西分享给其他人，因为：

> 知识分享是最基本的友谊，因为它能够让你在不失去任何东西的情况下赠人玫瑰。 -- Richard Stallman

---

<h2 id="12">12. 译者注</h2>

- 本书翻译原文：[https://www.freecodecamp.org/news/the-docker-handbook/](https://www.freecodecamp.org/news/the-docker-handbook/)
- 原作者：`Farhan Hasin Chowdhury`
- 原项目仓库：[https://github.com/fhsinchy/docker-handbook-projects/](https://github.com/fhsinchy/docker-handbook-projects/)
- 译者：`冯兄话吉`
- 译者项目克隆仓库：[https://github.com/FengMengZhao/the-docker-handbook/](https://github.com/FengMengZhao/the-docker-handbook/)
- 译者gitee项目同步仓库（GitHub访问异常使用）：[https://gitee.com/fengmengzhao/the-docker-handbook/](https://gitee.com/fengmengzhao/the-docker-handbook/)

---

<p align="center" style="color: red">本书完</p>
