/**
 * @file 特殊的 Fence Block 处理
 * @author leon <ludafa@outlook.com>
 */

const DEFAULT_OPTIONS = {
    validate: defaultValidate,
    render: defaultRender,
    marker: '`'
};

function defaultValidate(params) {
    return params.trim().split(' ', 2)[0] === name;
}

function defaultRender(tokens, idx, options, env, self) {

    if (tokens[idx].nesting === 1) {
        tokens[idx].attrPush(['class', name]);
    }

    return self.renderToken(tokens, idx, options, env, self);

}

const MARKER_LEN = 3;

module.exports = function (md, name, options) {

    let  {
        validate,
        render,
        marker
    } = Object.assign({}, DEFAULT_OPTIONS, options);

    function fence(state, startLine, endLine, silent) {

        let begin = state.bMarks[startLine] + state.tShift[startLine];
        let end = state.eMarks[startLine];
        let haveEndMarker = false;

        if (
            // if it's indented more than 3 spaces, it should be a code block
            state.sCount[startLine] - state.blkIndent >= 4
            // 此行没有至少 3 个字段
            || begin + 3 > end
        ) {
            return false;
        }

        // 不是以 marker 开头
        for (let i = 0; i < MARKER_LEN; i++) {
            if (state.src.charAt(begin + i) !== marker) {
                return false;
            }
        }

        let markup = state.src.slice(begin, begin + MARKER_LEN);
        let params = state.src.slice(begin + MARKER_LEN, end);

        // 同一行里后边还有 marker，那这么这一行不是 fence
        if (params.indexOf(marker) >= 0) {
            return false;
        }

        // 校验不通过直接返回
        if (!validate(params)) {
            return false;
        }

        // 找到了 marker，且被标识为 silent 模式，那么只返回一个 true，表示当前块应该结束
        if (silent) {
            return true;
        }

        let nextLine = startLine + 1;

        for (;nextLine <= endLine; nextLine++) {

            let begin = state.bMarks[nextLine] + state.tShift[nextLine];
            let end = state.eMarks[nextLine];
            let mem = begin;

            if (begin < end && state.sCount[nextLine] < state.blkIndent) {
                break;
            }

            if (state.src.charAt(begin) !== marker) {
                continue;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
                continue;
            }

            begin = state.skipChars(begin, marker.charCodeAt(0));

            if (begin - mem < MARKER_LEN) {
                continue;
            }

            begin = state.skipSpaces(begin);

            if (begin < end) {
                continue;
            }

            haveEndMarker = true;

            break;

        }

        // 吃掉匹配到的 N 行
        state.line = nextLine + (haveEndMarker ? 1 : 0);

        let token = state.push(name, 'div', 0);

        token.info = params;
        token.content = state.getLines(
            startLine + 1,
            nextLine,
            state.sCount[startLine],
            true
        );

        token.markup = markup;
        token.map = [startLine, state.line];

        return true;

    }

    md.block.ruler.before(
        'fence',
        name,
        fence,
        {
            alt: ['paragraph', 'reference', 'blockquote', 'list']
        }
    );

    md.renderer.rules[name] = render;

};
