<template>
    <div class="steps" aria-label="Multi-step indicator">
        <ol class="steps__list">
            <li class="step" :class="[ {'step--completed' : progress > 1}, {'step--current': progress == 1} ]">
                <a href="#0" class="step__label">Info</a>
                <span class="step__separator" aria-hidden="true">
                    <svg class="icon" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="6.5,3.5 11,8 6.5,12.5 "></polyline></g></svg>
                </span>
                <div class="step__circle" aria-hidden="true">
                    <svg class="icon" viewBox="0 0 16 16"><g v-if="progress > 1" stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="1,9 5,13 15,3 " data-cap="butt"></polyline></g></svg>
                </div>
            </li>

            <li class="step" :class="[ {'step--completed' : progress > 2}, {'step--current': progress == 2} ]">
                <a class="step__label">Verify</a>
                <span class="step__separator" aria-hidden="true">
                    <svg class="icon" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="6.5,3.5 11,8 6.5,12.5 "></polyline></g></svg>
                </span>
                <div class="step__circle" aria-hidden="true">
                    <svg class="icon" viewBox="0 0 16 16"><g v-if="progress > 2" stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="1,9 5,13 15,3 " data-cap="butt"></polyline></g></svg>
                </div>
            </li>

            <li class="step" :class="[ {'step--completed' : progress > 3}, {'step--current': progress == 3} ]" >
                <a class="step__label">Done</a>
                <div class="step__circle" aria-hidden="true">
                    <svg class="icon" viewBox="0 0 16 16"><g  v-if="progress > 3" stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="1,9 5,13 15,3 " data-cap="butt"></polyline></g></svg>
                </div>

            </li>
        </ol>
        </div>
</template>

<script> export default {
name: "Steps",
    props: [
        "progress"
    ]
}

</script>

<style lang="scss" scoped>


/* -------------------------------- 

File#: _1_steps
Title: Steps
Descr: Multi-step indicator

-------------------------------- */

$--steps-number: 3;
$--step-separator-line-stroke: 3px;
$--step-separator-line-gap: 3px;
$--step-circle-size: 32px;
$--step-circle-font-size: 1em;

.steps {
    background-color: var(--color-surface);
    padding: var(--component-padding);
    border-radius: var(--radius-md);
}

.steps__list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: calc(var(--space-xs) * -1);
}

.step {
    display: inline-block;//flex fallback
    display: inline-flex;
    align-items: center;
    margin-bottom: var(--space-xs);
}

.step__label {
    color: inherit;
    text-decoration: none;
}

.step--completed .step__label, .step--current .step__label {
    color: var(--color-primary);
}

.step--completed .step__label {
    text-decoration: underline;
}

.step__separator { // on small devices -> icon separator
    margin: 0 var(--space-xs);

    //flex fallback
    display: inline-block;
    vertical-align: middle;

    .icon {
        display: block;
        color: inherit;
    }
}

.step__circle {
    display: none;
}

.steps {
    background-color: transparent;
    padding: calc(#{$--step-circle-size}/2) 0 0;
    font-size: 0.85em;
}

.steps__list {
    margin-bottom: initial;
    align-items: flex-start;

    @supports (grid-area: auto) {
        display: grid;
        align-items: start;
        grid-template-columns: repeat(#{$--steps-number}, 1fr);
    }
}

.step {
    float: left;//flex fallback
    width: calc(100% / #{$--steps-number});
    justify-content: center;
    text-align: center;
    position: relative;
    margin-bottom: initial;
    padding: 0 var(--space-xs);

    @supports (grid-area: auto) {
        width: auto;
    }
}

.step__label {
    display: inline-block;//flex fallback
    margin-top: calc(var(--space-xxs) + #{$--step-circle-size}/2);
}

.step__separator {
    position: absolute;
    top: calc(#{$--step-separator-line-stroke} * -1/2);
    left: calc(50% + #{$--step-circle-size}/2 + #{$--step-separator-line-gap});
    height: #{$--step-separator-line-stroke};
    width: calc(100% - #{$--step-circle-size} - #{$--step-separator-line-gap}*2);
    margin: 0;
    background-color: var(--color-contrast-low);
    color: transparent;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;

    .step--completed & {
        background-color: var(--color-primary);
    }
}

.step__circle {
    //flex fallback
    display: inline-block;
    line-height: $--step-circle-size;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-contrast-low);
    width: $--step-circle-size;
    height: $--step-circle-size;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - #{$--step-circle-size}/2);
    top: calc(#{$--step-circle-size} * -1/2);
    font-size: $--step-circle-font-size;

    .icon {
        width: var(--step-circle-font-size);
        height: var(--step-circle-font-size);
        color: inherit;
    }

    .step--completed &, .step--current & {
        background-color: var(--color-primary);
        color: var(--color-white);
        @include fontSmooth;
    }
}


/* screen reader */
.step--completed .step__label::after,
.step--current .step__label::after {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
}

.step--completed .step__label::after {
    content: 'step completed';
}

.step--current .step__label::after {
    content: 'step current';
}

</style>
