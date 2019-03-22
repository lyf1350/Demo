<template>
  <div class="text-center">
    <br>
    <br>
    <br>
    ID:{{$store.state.user.id}}
    <br>
    用户名:{{$store.state.user.username}}
    <br>
    手机:{{$store.state.user.phone}}
    <br>
    邮箱:{{$store.state.user.email}}
    <br>
    角色:{{$store.state.user.members.map(x=>x.role.roleName)}}
    <br>
    组:{{$store.state.user.members.map(x=>x.group.groupName)}}
  </div>
</template>
