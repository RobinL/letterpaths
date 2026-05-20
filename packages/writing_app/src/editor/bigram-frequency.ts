// Source: https://gist.github.com/lydell/c439049abac2c9226e53
// Order is descending English bigram frequency.
export const bigramFrequencyOrder = [
  "th", "he", "in", "er", "an", "re", "on", "at", "en", "nd", "ti", "es", "or", "te", "of", "ed", "is", "it",
  "al", "ar", "st", "to", "nt", "ng", "se", "ha", "as", "ou", "io", "le", "ve", "co", "me", "de", "hi", "ri",
  "ro", "ic", "ne", "ea", "ra", "ce", "li", "ch", "ll", "be", "ma", "si", "om", "ur", "ca", "el", "ta", "la",
  "ns", "di", "fo", "ho", "pe", "ec", "pr", "no", "ct", "us", "ac", "ot", "il", "tr", "ly", "nc", "et", "ut",
  "ss", "so", "rs", "un", "lo", "wa", "ge", "ie", "wh", "ee", "wi", "em", "ad", "ol", "rt", "po", "we", "na",
  "ul", "ni", "ts", "mo", "ow", "pa", "im", "mi", "ai", "sh", "ir", "su", "id", "os", "iv", "ia", "am", "fi",
  "ci", "vi", "pl", "ig", "tu", "ev", "ld", "ry", "mp", "fe", "bl", "ab", "gh", "ty", "op", "wo", "sa", "ay",
  "ex", "ke", "fr", "oo", "av", "ag", "if", "ap", "gr", "od", "bo", "sp", "rd", "do", "uc", "bu", "ei", "ov",
  "by", "rm", "ep", "tt", "oc", "fa", "ef", "cu", "rn", "sc", "gi", "da", "yo", "cr", "cl", "du", "ga", "qu",
  "ue", "ff", "ba", "ey", "ls", "va", "um", "pp", "ua", "up", "lu", "go", "ht", "ru", "ug", "ds", "lt", "pi",
  "rc", "rr", "eg", "au", "ck", "ew", "mu", "br", "bi", "pt", "ak", "pu", "ui", "rg", "ib", "tl", "ny", "ki",
  "rk", "ys", "ob", "mm", "fu", "ph", "og", "ms", "ye", "ud", "mb", "ip", "ub", "oi", "rl", "gu", "dr", "hr",
  "cc", "tw", "ft", "wn", "nu", "af", "hu", "nn", "eo", "vo", "rv", "nf", "xp", "gn", "sm", "fl", "iz", "ok",
  "nl", "my", "gl", "aw", "ju", "oa", "eq", "sy", "sl", "ps", "jo", "lf", "nv", "je", "nk", "kn", "gs", "dy",
  "hy", "ze", "ks", "xt", "bs", "ik", "dd", "cy", "rp", "sk", "xi", "oe", "oy", "ws", "lv", "dl", "rf", "eu",
  "dg", "wr", "xa", "yi", "nm", "eb", "rb", "tm", "xc", "eh", "tc", "gy", "ja", "hn", "yp", "za", "gg", "ym",
  "sw", "bj", "lm", "cs", "ii", "ix", "xe", "oh", "lk", "dv", "lp", "ax", "ox", "uf", "dm", "iu", "sf", "bt",
  "ka", "yt", "ek", "pm", "ya", "gt", "wl", "rh", "yl", "hs", "ah", "yc", "yn", "rw", "hm", "lw", "hl", "ae",
  "zi", "az", "lc", "py", "aj", "iq", "nj", "bb", "nh", "uo", "kl", "lr", "tn", "gm", "sn", "nr", "fy", "mn",
  "dw", "sb", "yr", "dn", "sq", "zo", "oj", "yd", "lb", "wt", "lg", "ko", "np", "sr", "nq", "ky", "ln", "nw",
  "tf", "fs", "cq", "dh", "sd", "vy", "dj", "hw", "xu", "ao", "ml", "uk", "uy", "ej", "ez", "hb", "nz", "nb",
  "mc", "yb", "tp", "xh", "ux", "tz", "bv", "mf", "wd", "oz", "yw", "kh", "gd", "bm", "mr", "ku", "uv", "dt",
  "hd", "aa", "xx", "df", "db", "ji", "kr", "xo", "cm", "zz", "nx", "yg", "xy", "kg", "tb", "dc", "bd", "sg",
  "wy", "zy", "aq", "hf", "cd", "vu", "kw", "zu", "bn", "ih", "tg", "xv", "uz", "bc", "xf", "yz", "km", "dp",
  "lh", "wf", "kf", "pf", "cf", "mt", "yu", "cp", "pb", "td", "zl", "sv", "hc", "mg", "pw", "gf", "pd", "pn",
  "pc", "rx", "tv", "ij", "wm", "uh", "wk", "wb", "bh", "oq", "kt", "rq", "kb", "cg", "vr", "cn", "pk", "uu",
  "yf", "wp", "cz", "kp", "dq", "wu", "fm", "wc", "md", "kd", "zh", "gw", "rz", "cb", "iw", "xl", "hp", "mw",
  "vs", "fc", "rj", "bp", "mh", "hh", "yh", "uj", "fg", "fd", "gb", "pg", "tk", "kk", "hq", "fn", "lz", "vl",
  "gp", "hz", "dk", "yk", "qi", "lx", "vd", "zs", "bw", "xq", "mv", "uw", "hg", "fb", "sj", "ww", "gk", "uq",
  "bg", "sz", "jr", "ql", "zt", "hk", "vc", "xm", "gc", "fw", "pz", "kc", "hv", "xw", "zw", "fp", "iy", "pv",
  "vt", "jp", "cv", "zb", "vp", "zr", "fh", "yv", "zg", "zm", "zv", "qs", "kv", "vn", "zn", "qa", "yx", "jn",
  "bf", "mk", "cw", "jm", "lq", "jh", "kj", "jc", "gz", "js", "tx", "fk", "jl", "vm", "lj", "tj", "jj", "cj",
  "vg", "mj", "jt", "pj", "wg", "vh", "bk", "vv", "jd", "tq", "vb", "jf", "dz", "xb", "jb", "zc", "fj", "yy",
  "qn", "xs", "qr", "jk", "jv", "qq", "xn", "vf", "px", "zd", "qt", "zp", "qo", "dx", "hj", "gv", "jw", "qc",
  "jy", "gj", "qb", "pq", "jg", "bz", "mx", "qm", "mz", "qf", "wj", "zq", "xr", "zk", "cx", "fx", "fv", "bx",
  "vw", "vj", "mq", "qv", "zf", "qe", "yj", "gx", "kx", "xg", "qd", "xj", "sx", "vz", "vx", "wv", "yq", "bq",
  "gq", "vk", "zj", "xk", "qp", "hx", "fz", "qh", "qj", "jz", "vq", "kq", "xd", "qw", "jx", "qx", "kz", "wx",
  "fq", "xz", "zx", "jq", "qg", "qk", "qy", "qz", "wq", "wz"
] as const

export const bigramFrequencyRank = new Map<string, number>(
  bigramFrequencyOrder.map((pair, index) => [pair, index])
)
