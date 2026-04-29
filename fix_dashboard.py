import re

file_path = r'c:\Users\rawi1\Downloads\التوظيف-الذكي-_-smart-recruitment\src\components\Dashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove window.confirm for filtered -> pending
content = re.sub(
    r'if\s*\(\s*window\.confirm\(\s*"هل ترغب في استعادة المتقدم وإعادته لقائمة المراجعة\?"\s*\)\s*\)\s*\{\s*handleDecision\(row\.id,\s*"pending"\);\s*\}',
    r'e.stopPropagation(); handleDecision(row.id, "pending");',
    content
)

# Remove window.confirm for interview/rejected/accepted -> pending
content = re.sub(
    r'if\s*\(\s*window\.confirm\(\s*"هل أنت متأكد من رغبتك في التراجع عن هذا القرار وإعادته لقيد المراجعة\?"\s*\)\s*\)\s*\{\s*handleDecision\(row\.id,\s*"pending"\);\s*\}',
    r'e.stopPropagation(); handleDecision(row.id, "pending");',
    content
)

# Fix onClick parameters
content = content.replace(
    'onClick={() => {\n                                        e.stopPropagation(); handleDecision(row.id, "pending");',
    'onClick={(e) => {\n                                        e.stopPropagation(); handleDecision(row.id, "pending");'
)

content = content.replace(
    'onClick={() => {\n                                         e.stopPropagation(); handleDecision(row.id, "pending");',
    'onClick={(e) => {\n                                         e.stopPropagation(); handleDecision(row.id, "pending");'
)

# Remove interview modal block
content = re.sub(
    r'\{row\.decision === "interview" && \(\s*<button\s*onClick=\{\(\) => \{\s*setApplicantToInterview\(row\);\s*setShowInterviewModal\(true\);\s*\}\}.*?إرسال دعوة\s*</button>\s*\)\}',
    r'',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
