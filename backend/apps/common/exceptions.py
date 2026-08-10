from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    data = response.data
    if isinstance(data, dict) and 'detail' in data and len(data) == 1:
        response.data = {'success': False, 'message': data['detail']}
    else:
        response.data = {'success': False, 'errors': data}
    return response
