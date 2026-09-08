"""
Bare-minimum calculator tool.
Safely evaluates arithmetic expressions using Python's ast module
(no eval() on raw strings).
"""

import ast
import operator

_ALLOWED_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.Mod: operator.mod,
}


def _eval_node(node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp):
        op_type = type(node.op)
        if op_type not in _ALLOWED_OPS:
            raise ValueError(f"Operator {op_type} not allowed")
        return _ALLOWED_OPS[op_type](_eval_node(node.left), _eval_node(node.right))
    if isinstance(node, ast.UnaryOp):
        op_type = type(node.op)
        if op_type not in _ALLOWED_OPS:
            raise ValueError(f"Operator {op_type} not allowed")
        return _ALLOWED_OPS[op_type](_eval_node(node.operand))
    raise ValueError(f"Unsupported expression: {node}")


def calculate(expression: str):
    """Evaluate a basic arithmetic expression string safely."""
    try:
        tree = ast.parse(expression, mode="eval")
        result = _eval_node(tree.body)
        return {"expression": expression, "result": result}
    except Exception as e:
        return {"expression": expression, "error": str(e)}


def looks_like_math(text: str) -> bool:
    """Very simple heuristic: does the text look like a math expression?"""
    allowed_chars = set("0123456789+-*/(). ")
    stripped = text.strip()
    if not stripped:
        return False
    return all(c in allowed_chars for c in stripped)
