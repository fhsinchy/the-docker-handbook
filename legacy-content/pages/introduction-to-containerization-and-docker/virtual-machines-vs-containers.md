# Virtual Machines vs Containers

A virtual machine is the emulated equivalent of a physical computer system with their virtual CPU, memory, storage, and operating system.

A program known as a hypervisor creates and runs virtual machines. The physical computer running a hypervisor is called the host system, while the virtual machines are called guest systems.

![](../.gitbook/assets/virtual-machines.svg)

The hypervisor treats resources — like the CPU, memory, and storage — as a pool that can be easily reallocated between the existing guest virtual machines.

Hypervisors are of two types:

* Type 1 Hypervisor \(VMware vSphere, KVM, Microsoft Hyper-V\).
* Type 2 Hypervisor \(Oracle VM VirtualBox, VMware Workstation Pro/VMware Fusion\).

A container is an abstraction at the application layer that packages code and dependencies together. Instead of virtualizing the entire physical machine, containers virtualize the host operating system only.

![](../.gitbook/assets/containers.svg)

Containers sit on top of the physical machine and its operating system. Each container shares the host operating system kernel and, usually, the binaries and libraries, as well.

