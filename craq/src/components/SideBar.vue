<template>
  <aside>
    <div class="menu-wrapper">
      <menu class="menu">
        <li class="menu__item">
          <font-awesome-icon icon="globe"/><span class="menu__item--icon-text">Main</span>
        </li>

        <li class="menu__separator" role="separator"></li>

        <li class="menu__item">
          <font-awesome-icon icon="bell"/><span class="menu__item--icon-text">Reliable</span>
        </li>
        <li class="menu__item">
          <font-awesome-icon icon="bell"/><span class="menu__item--icon-text">Answer</span>
        </li>
        <li class="menu__item">
          <font-awesome-icon icon="bell"/><span class="menu__item--icon-text">View</span>
        </li>
        <li class="menu__item">
          <font-awesome-icon icon="bell"/><span class="menu__item--icon-text">Helpful</span>
        </li>

        <li class="menu__separator" role="separator"></li>

        <li class="menu__label-wrapper"><span class="menu__label">Algorithms</span></li>
        <li><a class="menu__item" href="" role="menuitem">Link One</a></li>
        <li><a class="menu__item" href="" role="menuitem">Link Two</a></li>
      </menu>
    </div>
  </aside>
</template>


<script>
export default {
  name: "SideBar"
}
</script>

<style scoped lang="scss">
aside {
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
}
$--menu-item-padding: var(--space-xxs) var(--space-sm);

.menu {
  font-size: var(--text-md); //font-config
  font-weight: 300; // font-config

  &-wrapper {
    display: inline-block;
    position: relative;
    width: 100%;
    box-shadow: var(--shadow-sm);
  }

  list-style: none;
  padding: var(--space-xxs) 0;
  border-radius: var(--radius-sm);

  &__item {
    text-decoration: none;
    display: block;
    display: flex;
    align-items: center;
    padding: $--menu-item-padding;
    color: var(--color-on-surface);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      background-color: var(--color-tertiary-light);
    }
    &--icon-text {
      margin-left: var(--space-xxs);
    }
  }

  &__label-wrapper {
    padding: $--menu-item-padding;

  }

  &__label {
    text-transform: uppercase;
    font-size: 0.6em;
    letter-spacing: 0.1em;
    color: orangered;
  }
  &__separator {
    height: 1px;
    background-color: orangered;
    margin: $--menu-item-padding;
  }
}



</style>
